{
  outputs = inputs @ {
    self,
    home-manager,
    nixpkgs,
    ...
  }: {
    # nixos config
    nixosConfigurations = {
      "nixos" = nixpkgs.lib.nixosSystem {
        specialArgs = {inherit inputs;};
        modules = [
          (import ./system/nixos "demeter")
          home-manager.nixosModules.home-manager
          {networking.hostName = "nixos";}
        ];
      };
    };

    # macos hm config
    homeConfigurations = {
      "demeter" = home-manager.lib.homeManagerConfiguration {
        pkgs = nixpkgs.legacyPackages.x86_64-darwin;
        extraSpecialArgs = {inherit inputs;};
        modules = [
          ({pkgs, ...}: {
            nix.package = pkgs.nix;
            home.username = "demeter";
            home.homeDirectory = "/Users/demeter";
            imports = [./system/macos/home.nix];
          })
        ];
      };
    };
  };

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

    home-manager = {
      url = "github:nix-community/home-manager/release-25.05";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    marble = {
      url = "git+ssh://git@github.com/marble-shell/shell?ref=gtk4";
    };

    icon-browser = {
      url = "github:aylur/icon-browser";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    battery-notifier = {
      url = "github:aylur/battery-notifier";
      inputs.nixpkgs.follows = "nixpkgs";
    };

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
