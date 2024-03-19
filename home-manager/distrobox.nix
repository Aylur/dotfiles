{ pkgs, config, username, ... }: with builtins; let
  mkHome = box: ".local/share/distrobox/${box}";

  boxes = {
    fedora = {
      home = mkHome "Fedora";
      alias = "fedora";
      img = "quay.io/fedora/fedora:rawhide";
    };
    ubuntu = {
      home = mkHome "Ubuntu";
      alias = "ubuntu";
      img = "docker.io/library/ubuntu:22.04";
    };
    arch = {
      home = mkHome "Arch";
      alias = "arch";
      img = "docker.io/library/archlinux:latest";
    };
  };

  mkBoxLinks = box: let
    ln = config.lib.file.mkOutOfStoreSymlink;
    links = [
      ".bashrc"
      ".config/"
      ".local/"
      ".cache/"
    ];
  in listToAttrs (map (link: {
    name = "${box.home}/${link}";
    value = {
      source = ln "/home/${username}/${link}";
    };
  }) links);

  mkBoxAlias = let
    db = "${pkgs.distrobox}/bin/distrobox";
    bins = map (p: "${p}/bin") (with pkgs; [
      podman
      busybox
      neovim
      git
      nix
      nushell
      bat
      eza
      fd
      ripgrep
      fzf
    ]);
  in box: pkgs.writeShellScriptBin box.alias ''
    if ! ${db} list | grep ${box.alias}; then
        ${db} create \
          --name "${box.alias}" \
          --home /home/${username}/${box.home} \
          --image "${box.img}"
    fi

    export PATH="${concatStringsSep ":" bins}"
    ${db} enter ${box.alias}
  '';
in {
  home.packages = let
    aliases = mapAttrs (name: value: mkBoxAlias value) boxes;
  in (attrValues aliases) ++ [pkgs.distrobox];

  home.file = let
    links = mapAttrs (name: value: mkBoxLinks value) boxes;
  in foldl' (x: y: x // y) {} (attrValues links);
}
