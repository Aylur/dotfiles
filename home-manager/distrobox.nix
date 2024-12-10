{
  pkgs,
  config,
  ...
}: {
  imports = [./modules/distrobox.nix];

  programs.distrobox = {
    enable = true;

    boxes = let
      exec = "nu";
      packages = [
        "wl-clipboard"
        "git"
        config.programs.neovim.finalPackage
        pkgs.nushell
      ];
    in {
      ubuntu = {
        inherit exec packages;
        image = "quay.io/toolbx/ubuntu-toolbox:latest";
      };
      alpine = {
        inherit exec packages;
        image = "docker.io/library/alpine:latest";
      };
      fedora = {
        inherit exec;
        packages = packages ++ ["poetry python-devel mysql-devel"];
        image = "registry.fedoraproject.org/fedora-toolbox:rawhide";
      };
      arch = {
        inherit exec;
        image = "docker.io/library/archlinux:latest";
        packages =
          packages
          ++ [
            "base-devel"
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
  };
}
