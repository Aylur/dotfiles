{ pkgs, username, ... }: {

  imports = [
    /etc/nixos/hardware-configuration.nix
    ./asus.nix
    ./bootloader.nix
    # ./gnome.nix
    ./hyprland.nix
    ./locale.nix
    ./nix.nix
    ./nvidia.nix
    ./sound.nix
  ];

  documentation.nixos.enable = false;

  virtualisation = {
    podman.enable = true;
    libvirtd.enable = true;
  };

  programs = {
    dconf.enable = true;
  };

  environment.systemPackages = with pkgs; [
    gnome.gnome-software # for flatpak
    home-manager
    neovim
    git
    wget
  ];

  services = {
    xserver.enable = true;
    xserver.excludePackages = [ pkgs.xterm ];
    printing.enable = true;
    flatpak.enable = true;
  };

  # KDE Connect
  networking.firewall = rec {
    allowedTCPPortRanges = [{ from = 1714; to = 1764; }];
    allowedUDPPortRanges = allowedTCPPortRanges;
  };

  users.users.${username} = {
    isNormalUser = true;
    extraGroups = [ "networkmanager" "wheel" "libvirtd" ];
  };

  networking = {
    hostName = "nixos";
    networkmanager.enable = true;
  };

  system.stateVersion = "23.05";
}
