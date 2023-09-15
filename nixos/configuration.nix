{ pkgs, username, ... }: {

  imports = [
    /etc/nixos/hardware-configuration.nix
    ./asus.nix
    ./bootloader.nix
    ./gnome.nix
    ./hyprland.nix
    ./locale.nix
    ./nix.nix
    ./nvidia.nix
    ./sound.nix
  ];

  environment.systemPackages = with pkgs; [
    gnome.adwaita-icon-theme
    gnome.gnome-software
    gnome.nautilus

    neovim
    home-manager
    git
    tree
    wget
    glib
  ];

  programs = {
    dconf.enable = true;
  };

  services = {
    printing.enable = true;
    upower.enable = true;
    flatpak.enable = true;
    gvfs.enable = true;
    devmon.enable = true;
    udisks2.enable = true;
  };

  xdg.portal = {
    enable = true;
    extraPortals = [ pkgs.xdg-desktop-portal-gtk ];
  };

  users.users.${username} = {
    isNormalUser = true;
    extraGroups = [ "networkmanager" "wheel" ];
  };

  networking = {
    hostName = "nixos";
    networkmanager.enable = true;
  };

  system.stateVersion = "23.05";
}
