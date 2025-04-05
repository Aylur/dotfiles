{pkgs, ...}: let
  inherit (builtins) concatStringsSep filter typeOf;
  inherit (import ../scripts pkgs) box;
  nvim = import ../nvim {inherit pkgs;};

  mkBox = name: {
    image,
    exec ? "${pkgs.nushell}/bin",
    packages ? [],
  }: let
    distropkgs = concatStringsSep " " (filter
      (p: typeOf p == "string")
      (packages ++ ["wl-clipboard" "git"]));

    path =
      [
        "/bin"
        "/sbin"
        "/usr/bin"
        "/usr/sbin"
        "/usr/local/bin"
        "$HOME/.local/bin"
      ]
      ++ ["${nvim}/bin" "${pkgs.nushell}/bin"]
      ++ (map (p: "${p}/bin") (filter (p: typeOf p == "set") packages));

    db-exec = pkgs.writeShellScript "db-exec" ''
      export XDG_DATA_DIRS="/usr/share:/usr/local/share"
      export PATH="${builtins.concatStringsSep ":" path}"
      if [ $# -eq 0 ]; then ${exec}; else bash -c "$@"; fi
    '';
  in
    pkgs.writeShellScriptBin name ''
      ${box} ${name} ${image} ${db-exec} $@ --pkgs "${distropkgs}"
    '';
in {
  home.packages = [
    pkgs.distrobox
    (mkBox "ubuntu" {
      image = "quay.io/toolbx/ubuntu-toolbox:latest";
    })
    (mkBox "fedora" {
      image = "registry.fedoraproject.org/fedora-toolbox:rawhide";
      packages = ["gcc poetry python-devel mysql-devel pango-devel nodejs npm cargo" pkgs.lazygit];
    })
    (mkBox "alpine" {
      image = "docker.io/library/alpine:latest";
    })
    (mkBox "arch" {
      image = "docker.io/library/alpine:latest";
      packages = let
        yay = pkgs.writeShellScriptBin "yay" ''
          if [[ ! -f /bin/yay ]]; then
            tmpdir="$HOME/.yay-bin"
            if [[ -d "$tmpdir" ]]; then sudo rm -r "$tmpdir"; fi
            git clone https://aur.archlinux.org/yay-bin.git "$tmpdir"
            cd "$tmpdir"
            makepkg -si
            sudo rm -r "$tmpdir"
          fi
          /bin/yay $@
        '';
      in ["base-devel" yay];
    })
  ];
}
