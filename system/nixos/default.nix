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
        ./system.nix
        ./packages.nix
      ];

      services.solaar.enable = true;
      nix.nixPath = ["nixpkgs=${inputs.nixpkgs}"];

      programs.niri.enable = true;

      environment.sessionVariables = {
        FILE_MANAGER = "nautilus";
        BROWSER = "firefox";
        TERMINAL = "ghostty";
        VISUAL = "nvim";
        EDITOR = "nvim";
        PAGER = "bat";

        NIXPKGS_ALLOW_INSECURE = 1;
        NIXPKGS_ALLOW_UNFREE = 1;
        NIXOS_OZONE_WL = 1;

        QT_XCB_GL_INTEGRATION = "none"; # kde-connect
      };

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
    }
  ];
}
