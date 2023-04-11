{ config, pkgs, lib, ... }:
{
  imports = [
    ./starship.nix
    ./packages.nix
    ./files.nix
    ./helix.nix
    ./sh.nix
  ];

  nixpkgs.config.allowUnfree = true;
  nix.settings.experimental-features = [ "nix-command" "flakes" ];
  nix.package = pkgs.nix;

  targets.genericLinux.enable = true;
  
  home = {
    sessionVariables = {
      QT_XCB_GL_INTEGRATION = "none"; # kde-connect
      EDITOR = "nvim";
      VISUAL = "code";
      XCURSOR_THEME = "Qogir";
      NIXPKGS_ALLOW_UNFREE = "1";
    };

    pointerCursor = {
      package = pkgs.qogir-icon-theme;
      name = "Qogir";
      size = 24;
      gtk.enable = true;
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
  };
}
