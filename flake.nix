{
  description = "Home Manager configuration of Aylur";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    hyprland.url = "github:hyprwm/Hyprland";
    ags.url = "github:Aylur/ags";
  };

  outputs = { nixpkgs, home-manager, ... }@inputs:
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
      extraSpecialArgs = { inherit inputs username pkgs; };
      modules = [ ./home-manager/home.nix ];
    };
  };
}
