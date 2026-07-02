inputs:
inputs.nixpkgs.lib.nixosSystem {
  system = "x86_64-linux";
  specialArgs = {inherit inputs;};
  modules = [
    ({pkgs, ...}: {
      imports = [
        inputs.solaar.nixosModules.default
        inputs.home-manager.nixosModules.home-manager
        /etc/nixos/hardware-configuration.nix
        ./asus.nix
        ./audio.nix
        ./niri.nix
        ./locale.nix
        ./system.nix
      ];

      # logi MX keyboard & mice
      services.solaar.enable = true;

      # printing
      services = {
        avahi = {
          enable = true;
          nssmdns4 = true;
          openFirewall = true;
        };
        printing = {
          enable = true;
          drivers = with pkgs; [
            cups-filters
            cups-browsed
          ];
        };
      };

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
          news.display = "show";
          programs.home-manager.enable = true;
          home.stateVersion = "21.11";
          imports = [../../home];
        };
      };
    })
  ];
}
