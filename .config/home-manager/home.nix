{ config, pkgs, ... }:
{
  nixpkgs.config.allowUnfree = true;
  nix.settings.experimental-features = [ "nix-command" "flakes" ];
  nix.package = pkgs.nix;
  
  home = {
    sessionVariables = {
      QT_XCB_GL_INTEGRATION = "none";
      EDITOR = "nvim";
      VISUAL = "code";
    };
    packages = with pkgs; [
      # gnome
      gnome.gnome-tweaks
      gnome.dconf-editor
      # wm
      awesome bspwm
      eww-wayland rofi-wayland
      # tools
      socat jq tiramisu htop
      swaynotificationcenter wl-gammactl wlsunset wl-clipboard
      pavucontrol blueberry
      flameshot
      # fun
      neofetch jp2a pywal
      # file manager
      ranger cinnamon.nemo
      # cli
      bat exa fzf ripgrep     
      helix vscode
      distrobox
      nushell
      # langs
      nodejs cargo rustc
      agda jdk
      # fonts
      (nerdfonts.override { fonts = [
        "Ubuntu"
        "UbuntuMono"
        "CascadiaCode"
        "Mononoki"
        "Hack"
      ]; })
      rubik
      # themes
      qogir-theme #gtk
      qogir-icon-theme
      adw-gtk3
      # gui
      spotify transmission-gtk
    ];
    username = "demeter";
    homeDirectory = "/home/demeter";
    stateVersion = "21.11";
  };
  
  programs = {
    starship.enable = true;
    zsh = {
      enable = true;
      enableCompletion = true;
      enableAutosuggestions = true;
      enableSyntaxHighlighting = true;
      initExtra = ''
        zstyle ':completion:*' menu select
        nx() {
          if [[ $1 == 'search' ]]; then nix search nixpkgs#$2
          elif [[ $1 == 'run' ]]; then nix run nixpkgs#$2
          elif [[ $1 == 'list' ]]; then nix profile list
          elif [[ $1 == 'up' ]]; then nix profile upgrade '.*'
          elif [[ $1 == 'install' ]]; then nix profile install nixpkgs#$2
          elif [[ $1 == 'shell' ]]; then nix-shell -p $2
          fi
        }
      '';
      shellAliases = {
        "db" = "distrobox";
        "arch" = "distrobox-enter Arch";
        "fedora" = "distrobox-enter Fedora";
        "cat" = "bat";
        "ls" = "exa -l --sort type --no-permissions --no-user --no-time --header --icons --no-filesize --group-directories-first";
        "és" = "ls";
        "ll" = "exa -l --sort type --header --icons --group-directories-first";
        "firefox" = "flatpak run org.mozilla.firefox";
        "nv" = "nvim";
      };
    };
  };

  services = {
    kdeconnect = {
      enable = true;
      indicator = true;
    };
  };

  programs = {
    home-manager.enable = true;
  };
}
