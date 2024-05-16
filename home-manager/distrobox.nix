{
  pkgs,
  config,
  lib,
  ...
}: let
  boxes = mkBoxes {
    Alpine = {
      img = "docker.io/library/alpine:latest";
    };
    Fedora = {
      packages = "nodejs npm poetry gcc mysql-devel python3-devel";
      img = "quay.io/fedora/fedora:rawhide";
      nixPackages = [
        (pkgs.writeShellScriptBin "pr" "poetry run $@")
        (pkgs.writeShellScriptBin "prpm" "poetry run python manage.py $@")
      ];
    };
    Arch = {
      img = "docker.io/library/archlinux:latest";
      packages = "base-devel";
      nixPackages = [
        (pkgs.writeShellScriptBin "yay" ''
          if [[ ! -f /bin/yay ]]; then
            tmpdir="$HOME/.yay-bin"
            if [[ -d "$tmpdir" ]]; then sudo rm -r "$tmpdir"; fi
            git clone https://aur.archlinux.org/yay-bin.git "$tmpdir"
            cd "$tmpdir"
            makepkg -si
            sudo rm -r "$tmpdir"
          fi
          /bin/yay $@
        '')
      ];
    };
  };

  symlinks = [
    ".bashrc"
    ".zshrc"
    ".config/nushell"
    ".config/nvim"
    ".config/nix"
    ".config/starship.toml"
    ".local/"
    ".cache/"
  ];

  mkBoxes = let
    mkBox = name: {
      img,
      home ? ".local/share/distrobox/${name}",
      packages ? "",
      init ? "true",
      flags ? "",
      path ? [],
      nixPackages ? [],
    }: {
      inherit home img flags;
      init = pkgs.writeShellScript "init" init;
      alias = lib.strings.toLower name;
      packages = packages + " git neovim wl-clipboard";
      path =
        path
        ++ config.packages.cli
        ++ [
          "/bin"
          "/sbin"
          "/usr/bin"
          "/usr/sbin"
          "/usr/local/bin"
          "$HOME/.local/bin"
        ]
        ++ (map (p: "${p}/bin") nixPackages);
    };
  in
    attrs:
      builtins.attrValues
      (builtins.mapAttrs mkBox attrs);

  mkBoxLinks = box: let
    ln = config.lib.file.mkOutOfStoreSymlink;
  in
    builtins.listToAttrs (map (link: {
        name = "${box.home}/${link}";
        value = {
          source = ln "${config.home.homeDirectory}/${link}";
        };
      })
      symlinks);

  mkBoxAlias = box: let
    db = "${pkgs.distrobox}/bin/distrobox";
    exec = pkgs.writeShellScript "db-exec" ''
      export PATH="${builtins.concatStringsSep ":" box.path}"
      ${pkgs.nushell}/bin/nu
    '';
  in
    pkgs.writeShellScriptBin box.alias ''
      if ! ${db} list | grep ${box.alias}; then
         ${db} create ${box.flags} \
           --pull \
           --yes \
           --name "${box.alias}" \
           --home ${config.home.homeDirectory}/${box.home} \
           --image "${box.img}" \
           --init-hooks "${box.init}" \
           --additional-packages "${box.packages}"
      fi
      ${db} enter ${box.alias} --  ${exec}
    '';
in {
  home.packages = [pkgs.distrobox] ++ (map mkBoxAlias boxes);
  home.file = builtins.foldl' (acc: x: acc // x) {} (map mkBoxLinks boxes);
}
