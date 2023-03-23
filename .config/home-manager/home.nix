{ config, pkgs, lib, ... }:
{
  nixpkgs.config.allowUnfree = true;
  nix.settings.experimental-features = [ "nix-command" "flakes" ];
  nix.package = pkgs.nix;

  home = {

    sessionVariables = {
      QT_XCB_GL_INTEGRATION = "none"; # kde-connect
      EDITOR = "nvim";
      VISUAL = "code";
    };

    packages = with pkgs; [
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
      meson ninja sassc
      glib
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
      # asusclt
      asusctl
    ];

    file = {
      ".profile" = {
        text = ''
          . "$HOME/.nix-profile/etc/profile.d/hm-session-vars.sh"
        '';
      };
      ".local/share/fonts" = {
        recursive = true;
        source = ../../.nix-profile/share/fonts;
      };
      ".config/gtk-3.0/gtk.css" = {
        text = ".background.csd, headerbar{ border-radius: 0px; }";
      };
      ".config/gtk-4.0/gtk.css" = {
        text = ".background.csd, headerbar{ border-radius: 0px; }";
      };
      ".config/gtk-3.0/bookmarks" = {
        text = ''
          file:///home/demeter/Documents
          file:///home/demeter/Music
          file:///home/demeter/Pictures
          file:///home/demeter/Videos
          file:///home/demeter/Downloads
          file:///home/demeter/Projects Projects
          file:///home/demeter/School School
        '';
      };
      ".config/starship.toml" = {
      	source = ./starship/starship.toml;
      };
      ".config/nushell/config.hu" = {
        source = ./nushell/config.nu;
      };
      ".config/nushell/env.nu" = {
        source = ./nushell/env.nu;
      };
    };

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
        bindkey "^[[1;5C" forward-word
        bindkey "^[[1;5D" backward-word
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
    bash = {
      enable = true;
      bashrcExtra = ''
        nx() {
          flags="--extra-experimental-features nix-command --extra-experimental-features flakes"
          if [[ $1 == 'search' ]]; then nix search $flags nixpkgs#$2
            elif [[ $1 == 'run' ]]; then nix run $flags nixpkgs#$2
            elif [[ $1 == 'list' ]]; then nix profile list $flags
            elif [[ $1 == 'up' ]]; then nix profile $flags upgrade '.*'
            elif [[ $1 == 'install' ]]; then nix profile install $flags nixpkgs#$2
          fi
        }
        alias db='distrobox'
        alias arch='distrobox-enter Arch'
        alias fedora='distrobox-enter Fedora'
        alias cat='bat'
        alias ls='exa -l --sort type --no-permissions --no-user --no-time --header --icons --no-filesize --group-directories-first'
        alias ll='exa -l --sort type --header --icons --group-directories-first'
        alias és='ls'
        alias firefox='flatpak run org.mozilla.firefox'
      '';
    };
  };

  # xdg.desktopEntries = {
  #   "blueberry" = {
  #     name = "Bluetooth";
  #     exec = "blueberry";
  #     noDisplay = true;
  #   };
  # };

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
