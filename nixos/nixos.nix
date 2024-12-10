{
  inputs,
  lib,
  ...
}: let
  username = "demeter";
in {
  imports = [
    /etc/nixos/hardware-configuration.nix
    ./system.nix
    ./audio.nix
    ./locale.nix
    ./nautilus.nix
    ./laptop.nix
    ./hyprland.nix
    ./laptop.nix
  ];

  hyprland.enable = true;
  asusLaptop.enable = true;
  nix.nixPath = ["nixpkgs=${inputs.nixpkgs}"];

  users.users.${username} = {
    isNormalUser = true;
    initialPassword = username;
    extraGroups = [
      "nixosvmtest"
      "networkmanager"
      "wheel"
      "audio"
      "video"
      "libvirtd"
      "docker"
    ];
  };

  home-manager = {
    backupFileExtension = "backup";
    useGlobalPkgs = true;
    useUserPackages = true;
    extraSpecialArgs = {inherit inputs;};
    users.${username} = {
      home.username = username;
      home.homeDirectory = "/home/${username}";
      imports = [./home.nix];
    };
  };

  specialisation = {
    gnome.configuration = {
      imports = [./gnome.nix];
      system.nixos.tags = ["Gnome"];
      hyprland.enable = lib.mkForce false;
      gnome.enable = true;
    };
  };
}
