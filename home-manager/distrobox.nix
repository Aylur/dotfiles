{
  pkgs,
  config,
  ...
}: {
  imports = [./modules/distrobox.nix];

  programs.distrobox = {
    enable = true;

    boxes = let
      exec = "${pkgs.nushell}/bin/nu";
      symlinks = [
        ".bashrc"
        ".zshrc"
        ".git-credentials"
        ".config/git"
        ".config/nushell"
        ".config/nvim"
        ".config/nix"
        ".config/starship.toml"
      ];
      packages = ["wl-clipboard" "git" "neovim"];
      nixPackages =
        config.packages.cli
        ++ [
          config.programs.neovim.finalPackage
          pkgs.nix
          pkgs.git
          pkgs.nushell
        ];
    in {
      Ubuntu = {
        inherit exec symlinks nixPackages;
        packages = ["nodejs" "npm" "python3-dev" "pipx" "git" "wl-clipboard"];
        init = ''
          npm install -g corepack
          corepack enable
          pipx install poetry
        '';
        img = "quay.io/toolbx/ubuntu-toolbox:latest";
        home = "dev";
        alias = "dev";
      };
      Alpine = {
        inherit exec symlinks nixPackages packages;
        img = "docker.io/library/alpine:latest";
      };
      Fedora = {
        inherit exec symlinks nixPackages packages;
        img = "registry.fedoraproject.org/fedora-toolbox:rawhide";
      };
      Arch = {
        inherit exec symlinks;
        img = "docker.io/library/archlinux:latest";
        packages = packages ++ ["base-devel"];
        nixPackages =
          nixPackages
          ++ [
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
