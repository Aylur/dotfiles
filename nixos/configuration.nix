{ pkgs, username, ... }: {

  imports = [
    /etc/nixos/hardware-configuration.nix
    ./gnome.nix
    ./hyprland.nix
    ./locale.nix
    ./nvidia.nix
    ./audio.nix
  ];

  # nix
  documentation.nixos.enable = false; # .desktop
  nixpkgs.config.allowUnfree = true;
  nix = {
    settings = {
      experimental-features = "nix-command flakes";
      auto-optimise-store = true;
    };
  };

  # virtualisation
  virtualisation = {
    podman.enable = true;
    libvirtd.enable = true;
  };

  # dconf
  programs.dconf.enable = true;

  # packages
  environment.systemPackages = with pkgs; [
    home-manager
    neovim
    git
    wget
  ];

  # asusctl
  services.asusd.enable = true;
  programs.rog-control-center.enable = true;

  # services
  services = {
    xserver.enable = true;
    xserver.excludePackages = [ pkgs.xterm ];
    printing.enable = true;
    flatpak.enable = true;
  };

  # kde connect
  networking.firewall = rec {
    allowedTCPPortRanges = [{ from = 1714; to = 1764; }];
    allowedUDPPortRanges = allowedTCPPortRanges;
  };

  # user
  users.users.${username} = {
    isNormalUser = true;
    extraGroups = [
      "networkmanager"
      "wheel"
      "audio"
      "libvirtd"
    ];
  };

  # network
  networking = {
    hostName = "nixos";
    networkmanager.enable = true;
  };

  # bluetooth
  hardware.bluetooth = {
    enable = true;
    powerOnBoot = false;
    settings.General.Experimental = true; # for gnome-bluetooth percentage
  };

  # bootloader
  boot = {
    supportedFilesystems = [ "ntfs" ];
    loader = {
      timeout = 2;
      systemd-boot.enable = true;
      efi.canTouchEfiVariables = true;
    };
  };

  system.stateVersion = "23.05";
}
