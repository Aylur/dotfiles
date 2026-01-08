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
  in
    pkgs.writeShellScriptBin name ''
      box ${name} \
        --image ${image} \
        --pkgs "${distropkgs}" \
        --path "${concatStringsSep ":" bins}" \
        $@
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
      packages = with pkgs; [nushell starship];
    })
    (mkBox "fedora" {
      image = "registry.fedoraproject.org/fedora-toolbox:rawhide";
      packages = [
        "gcc poetry python-devel mysql-devel pango-devel nodejs npm cargo"
        pkgs.nushell
        pkgs.starship
      ];
    })
    (mkBox "alpine" {
      image = "docker.io/library/alpine:latest";
      packages = with pkgs; [nushell starship];
    })
    (mkBox "arch" {
      image = "docker.io/library/archlinux:latest";
      packages = ["base-devel" yay pkgs.nushell pkgs.starship];
    })
  ];
}
