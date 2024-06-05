{
  pkgs,
  lib,
  config,
  ...
}: {
  options.gnome = {
    enable = lib.mkEnableOption "Gnome";
  };

  config = lib.mkIf config.gnome.enable {
    environment = {
      systemPackages = with pkgs; [
        morewaita-icon-theme
        qogir-icon-theme
        gnome-extension-manager
        wl-clipboard
      ];

      gnome.excludePackages =
        (with pkgs; [
          # gnome-text-editor
          gnome-console
          gnome-photos
          gnome-tour
          gnome-connections
          snapshot
          gedit
        ])
        ++ (with pkgs.gnome; [
          cheese # webcam tool
          gnome-music
          epiphany # web browser
          geary # email reader
          evince # document viewer
          gnome-characters
          totem # video player
          tali # poker game
          iagno # go game
          hitori # sudoku game
          atomix # puzzle game
          yelp # Help view
          gnome-contacts
          gnome-initial-setup
          gnome-shell-extensions
          gnome-maps
          gnome-font-viewer
        ]);
    };

    services.xserver = {
      displayManager.gdm.enable = true;
      desktopManager.gnome.enable = true;
    };

    programs.dconf.profiles.gdm.databases = [
      {
        settings = {
          "org/gnome/desktop/peripherals/touchpad" = {
            tap-to-click = true;
          };
          "org/gnome/desktop/interface" = {
            cursor-theme = "Qogir";
          };
        };
      }
    ];
  };
}
