inputs:
inputs.nixpkgs.lib.nixosSystem {
  system = "x86_64-linux";
  specialArgs = {inherit inputs;};
  modules = [
    {
      imports = [
        inputs.solaar.nixosModules.default
        inputs.home-manager.nixosModules.home-manager
        /etc/nixos/hardware-configuration.nix
        ./asus.nix
        ./audio.nix
        ./gnome.nix
        ./hyprland.nix
        ./locale.nix
        ./nautilus.nix
        ./niri.nix
        ./system.nix
      ];

      gnome.enable = true;
      hyprland.enable = true;
      niri.enable = true;
      asus.enable = true;

      services.solaar.enable = true;
      nix.nixPath = ["nixpkgs=${inputs.nixpkgs}"];

      users.users.demeter = {
        isNormalUser = true;
        initialPassword = "demeter";
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
        users.demeter = {
          home.username = "demeter";
          home.homeDirectory = "/home/demeter";
          imports = [./home.nix];
        };
      };
    }
  ];
}
