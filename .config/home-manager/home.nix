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
      XCURSOR_THEME = "Qogir";
    };

    pointerCursor = {
      package = pkgs.qogir-icon-theme;
      name = "Qogir";
      size = 24;
      gtk.enable = true;
    };

    packages = with pkgs; [
      # wm
      awesome bspwm
      eww-wayland rofi-wayland
      # tools
      socat jq tiramisu htop
      networkmanager wl-gammactl wlsunset wl-clipboard hyprpicker
      pavucontrol blueberry bluez brightnessctl playerctl imagemagick
      flameshot gtklock
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
      # helix lsp
      llvmPackages_9.libclang
      nodePackages.bash-language-server
      nodePackages.vscode-langservers-extracted
      nodePackages.typescript
      nodePackages.typescript-language-server
      nodePackages.svelte-language-server
      nodePackages.vls
      jdt-language-server
      lua-language-server
      marksman
      rnix-lsp
      rust-analyzer
      gopls
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
      ".config/gtk-4.0/gtk.css" = {
        text = ".background.csd{ border-radius: 12px; }";
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
      ".local/share/themes/adw-gtk3" = {
        source = ../../.nix-profile/share/themes/adw-gtk3;
      };
      ".local/share/themes/adw-gtk3-dark" = {
        source = ../../.nix-profile/share/themes/adw-gtk3-dark;
      };
      ".local/share/icons/Qogir-dark" = {
        recursive = true;
        source = ../../.nix-profile/share/icons/Qogir-dark;
      };
       ".local/share/icons/Qogir" = {
        recursive = true;
        source = ../../.nix-profile/share/icons/Qogir;
      };
    };

    username = "demeter";
    homeDirectory = "/home/demeter";
    stateVersion = "21.11";
  };
  
  gtk = {
    enable = true;
    font.name = "Ubuntu NF";
    cursorTheme = {
      name = "Qogir";
      package = pkgs.qogir-icon-theme;
    };
    gtk3 = {
      bookmarks = [
        "file:///home/demeter/Documents"
        "file:///home/demeter/Music"
        "file:///home/demeter/Pictures"
        "file:///home/demeter/Videos"
        "file:///home/demeter/Downloads"
        "file:///home/demeter/Projects Projects"
        "file:///home/demeter/School School"
      ];
      extraCss = "headerbar{ border-radius: 0; }";
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
      profileExtra = ''
        if [ -e /home/demeter/.nix-profile/etc/profile.d/nix.sh ]; then
          . /home/demeter/.nix-profile/etc/profile.d/nix.sh; fi

        if ! [[ "$PATH" =~ "$HOME/.local/bin:$HOME/bin:" ]]; then
          PATH="$HOME/.local/bin:$HOME/bin:$PATH"; fi

        if ! [[ "$PATH" =~ "$HOME/.nix-profile/bin:" ]]; then
          PATH="$HOME/.nix-profile/bin:$PATH"; fi

        export PATH
      '';
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
    helix = {
      enable = true;
      languages = [
        {
          name = "java";
          language-server = {
            command = "jdtls";
            args = ["-data" "/home/my_user/.cache/jdtls/my_project"];
          };
        }
      ];
      settings = {
        theme = "dark_plus";
        editor = {
          line-number = "absolute";
          color-modes = true;
        };
        editor.statusline = {
          left = ["mode" "spinner"];
          center = [];
          right = ["diagnostics" "spacer" "selections" "position" "spacer" "file-encoding" "file-line-ending" "file-type"];
          separator = "│";
          mode.normal = "NORMAL";
          mode.insert = "INSERT";
          mode.select = "SELECT";
        };
        editor.lsp = {
          display-messages = true;
          # display-inline-hints = true;
        };
        editor.cursor-shape = {
          normal = "block";
          insert = "bar";
          select = "bar";
        };
        editor.file-picker = {
          hidden = false;
        };
        editor.search = {
          smart-case = false;
        };
        editor.indent-guides = {
          render = true;
          character = "┊";
          skip-levels = 0;
        };
      };
    };
  };
}
