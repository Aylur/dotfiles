{
  description = "Home Manager and NixOS configuration of Aylur";

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
      inherit system;
      specialArgs = { inherit inputs username hostname asztal; };
      modules = [ ./nixos/configuration.nix ];
    };

    homeConfigurations.${username} = home-manager.lib.homeManagerConfiguration {
      inherit pkgs;
      extraSpecialArgs = { inherit inputs username asztal; };
      modules = [ ./home-manager/home.nix ];
    };

    packages.${system}.default = asztal;
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
