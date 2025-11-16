{pkgs, ...}: let
  inherit (builtins) concatStringsSep filter typeOf;

  mkBox = name: {
    image,
    packages ? [],
  }: let
    distropkgs = concatStringsSep " " (
      filter (p: typeOf p == "string") packages
    );
    bins = map (p: "${p}/bin") (
      filter (p: typeOf p == "set") packages
    );
    path = concatStringsSep ":" (bins
      ++ [
        "/bin"
        "/sbin"
        "/usr/bin"
        "/usr/sbin"
        "/usr/local/bin"
        "$HOME/.local/bin"
      ]);
  in
    pkgs.writeShellScriptBin name ''
      export PATH="${path}"
      box ${name} ${image} --pkgs "${distropkgs}" $@
    '';

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
in {
  home.packages = [
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
      image = "docker.io/library/archlinux:latest";
      packages = ["base-devel" yay];
    })
  ];
}
