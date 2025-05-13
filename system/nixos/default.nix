username: {
  inputs,
  lib,
  ...
}: {
  imports = [
    /etc/nixos/hardware-configuration.nix
    ./asus.nix
    ./audio.nix
    ./gnome.nix
    ./hyprland.nix
    ./locale.nix
    ./nautilus.nix
    ./system.nix
  ];

  gnome.enable = true;
  hyprland.enable = false;
  asus.enable = false;

  nix.nixPath = ["nixpkgs=${inputs.nixpkgs}"];

  # FIXME: remove
  virtualisation.virtualbox.host.enable = true;
  users.extraGroups.vboxusers.members = ["demeter"];

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
    hyprland.configuration = {
      system.nixos.tags = ["Hyprland"];
      hyprland.enable = lib.mkForce true;
      gnome.enable = lib.mkForce false;
    };
  };
}
