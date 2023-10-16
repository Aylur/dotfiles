{
  description = "Home Manager configuration of Aylur";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/gnome";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    hyprland.url = "github:hyprwm/Hyprland";
    ags.url = "github:Aylur/ags";
    lf-icons = {
      url = "https://raw.githubusercontent.com/gokcehan/lf/master/etc/icons.example";
      flake = false;
    };
    more-waita = {
      url = "https://github.com/somepaulo/MoreWaita/archive/refs/heads/main.zip";
      flake = false;
    };
  };

  outputs = { home-manager, nixpkgs, ... }@inputs:
  let
    username = "demeter";
    system = "x86_64-linux";
    pkgs = import nixpkgs {
      inherit system;
      config.allowUnfree = true;
    };
  in
  {
    nixosConfigurations."nixos" = nixpkgs.lib.nixosSystem {
      specialArgs = { inherit inputs username system; };
      modules = [ ./nixos/configuration.nix ];
    };

    homeConfigurations."${username}" = home-manager.lib.homeManagerConfiguration {
      inherit pkgs;
      extraSpecialArgs = { inherit inputs username; };
      modules = [ ./home-manager/home.nix ];
    };
  };
}
