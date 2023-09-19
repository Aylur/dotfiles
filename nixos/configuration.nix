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

  virtualisation.podman.enable = true;

  environment.systemPackages = with pkgs; [
    gnome.gnome-software # for flatpak
    home-manager
    neovim
    git
    tree
    wget
  ];

  services = {
    xserver.enable = true;
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
    extraGroups = [ "networkmanager" "wheel" ];
  };

  networking = {
    hostName = "nixos";
    networkmanager.enable = true;
  };

  system.stateVersion = "23.05";
}
