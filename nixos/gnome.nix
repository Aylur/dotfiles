{ pkgs, ... }:
{
  services.xserver = {
    displayManager.gdm.enable = true;
    desktopManager.gnome.enable = true;
    desktopManager.gnome.debug = true;
  };

  programs.dconf.profiles = {
    gdm.databases = [{
      settings = {
        "org/gnome/desktop/peripherals/touchpad" = {
          tap-to-click = true;
        };
        "org/gnome/desktop/interface" = {
          cursor-theme = "Qogir";
        };
      };
    }];
  };

  environment.systemPackages = with pkgs; [
    gnome-extension-manager
    nautilus-open-any-terminal
    qogir-icon-theme
  ];

  environment.gnome.excludePackages = (with pkgs; [
    gnome-text-editor
    gnome-console
    gnome-photos
    gnome-tour
    gnome-connections
  ]) ++ (with pkgs.gnome; [
    cheese # webcam tool
    gnome-music
    gedit # text editor
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
}
