{pkgs, ...}: {
  environment = {
    systemPackages = with pkgs; [
      gnomeExtensions.just-perfection
      gnomeExtensions.color-picker
      gnomeExtensions.user-themes
    ];

    gnome.excludePackages = with pkgs; [
      # gnome-text-editor
      # gnome-console
      gnome-photos
      gnome-tour
      gnome-connections
      snapshot
      gedit
      cheese # webcam tool
      epiphany # web browser
      geary # email reader
      evince # document viewer
      totem # video player
      yelp # Help view
      gnome-font-viewer
      gnome-shell-extensions
      gnome-maps
      gnome-music
      gnome-characters
      tali # poker game
      iagno # go game
      hitori # sudoku game
      atomix # puzzle game
      gnome-contacts
      gnome-initial-setup
    ];
  };

  programs.kdeconnect = {
    enable = true;
    # package = pkgs.gnomeExtensions.gsconnect;
  };

  services = {
    desktopManager.gnome.enable = true;
    displayManager.gdm = {
      enable = true;
      wayland = true;
    };
  };

  programs.dconf.profiles.gdm.databases = [
    {
      settings = {
        "org/gnome/desktop/peripherals/touchpad" = {
          tap-to-click = true;
        };
        "org/gnome/desktop/interface" = {
          cursor-theme = "Qogir";
          font-name = "Ubuntu Nerd Font 11";
        };
      };
    }
  ];
}
