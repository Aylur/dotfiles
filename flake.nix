{
  description = "Configurations of Aylur";

  outputs = inputs@{ self, home-manager, nixpkgs, ... }: {
    packages.x86_64-linux.default =
      nixpkgs.legacyPackages.x86_64-linux.callPackage ./ags {inherit inputs;};

    # nixos config
    nixosConfigurations = {
      "nixos" = let
        username = "demeter";
        hostname = "nixos";
      in
      nixpkgs.lib.nixosSystem rec {
        system = "x86_64-linux";
        specialArgs = {
          inherit inputs;
          asztal = self.packages.x86_64-linux.default;
        };
        modules = [
          ./nixos/nixos.nix
          home-manager.nixosModules.home-manager
          {
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
            networking = {
              hostName = hostname;
              networkmanager.enable = true;
            };
          }
          {
            home-manager = {
              useGlobalPkgs = true;
              useUserPackages = true;
              extraSpecialArgs = specialArgs;
              users.${username} = {
                home.username = username;
                home.homeDirectory = "/home/${username}";
                imports = [./nixos/home.nix];
              };
            };
          }
        ];
      };
    };
  };

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    hyprland.url = "github:hyprwm/Hyprland";
    hyprland-plugins.url = "github:hyprwm/hyprland-plugins";

    matugen.url = "github:InioX/matugen";
    ags.url = "github:Aylur/ags";
    astal.url = "github:Aylur/astal";
    stm.url = "github:Aylur/stm";

    lf-icons = {
      url = "github:gokcehan/lf";
      flake = false;
    };
    firefox-gnome-theme = {
      url = "github:rafaelmardojai/firefox-gnome-theme";
      flake = false;
    };
  };
}
