{
  description = "Home Manager and NixOS configuration of Aylur";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    hyprland.url = "github:hyprwm/Hyprland";
    hyprland-plugins = {
      url = "github:hyprwm/hyprland-plugins";
      inputs.nixpkgs.follows = "hyprland";
    };

    matugen.url = "github:InioX/matugen";
    ags.url = "github:Aylur/ags";
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

  outputs = { home-manager, nixpkgs, ... }@inputs: let
    username = "demeter";
    hostname = "nixos";
    system = "x86_64-linux";
    pkgs = import nixpkgs {
      inherit system;
      config.allowUnfree = true;
    };
    asztal = pkgs.callPackage ./ags { inherit inputs; };
  in {
    nixosConfigurations.${hostname} = nixpkgs.lib.nixosSystem {
      specialArgs = {
        inherit inputs username hostname system;
        greeter = asztal.greeter;
      };
      modules = [
        ./nixos/configuration.nix
        # home-manager.nixosModules.home-manager {
        #   home-manager = {
        #     extraSpecialArgs = { inherit inputs username; };
        #     users.${username} = import ./home-manager/home.nix;
        #   };
        # }
      ];
    };

    homeConfigurations.${username} = home-manager.lib.homeManagerConfiguration {
      inherit pkgs;
      extraSpecialArgs = { inherit inputs username; };
      modules = [ ./home-manager/home.nix ];
    };

    packages.${system} = {
      config = asztal.desktop.config;
      default = asztal.desktop.script;
      greeter = asztal.greeter.script;
    };
  };
}
