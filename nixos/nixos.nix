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
    ./gnome.nix
  ];

  hyprland.enable = true;
  asusLaptop.enable = false;

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
      imports = [
        ../home-manager/nvim.nix
        ../home-manager/ags.nix
        ../home-manager/blackbox.nix
        ../home-manager/browser.nix
        ../home-manager/dconf.nix
        ../home-manager/distrobox.nix
        ../home-manager/git.nix
        ../home-manager/hyprland.nix
        ../home-manager/lf.nix
        ../home-manager/packages.nix
        ../home-manager/sh.nix
        ../home-manager/starship.nix
        ../home-manager/theme.nix
        ../home-manager/tmux.nix
        ../home-manager/wezterm.nix
        ./home.nix
      ];
    };
  };

  specialisation = {
    gnome.configuration = {
      system.nixos.tags = ["Gnome"];
      hyprland.enable = lib.mkForce false;
      gnome.enable = true;
    };
  };
}
