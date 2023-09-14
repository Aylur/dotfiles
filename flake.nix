{
  description = "Home Manager configuration of Aylur";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    nixgl.url = "github:guibou/nixGL";
    hyprland.url = "github:hyprwm/Hyprland";
    ags.url = "github:Aylur/ags";
  };

  outputs = { nixpkgs, nixgl, home-manager, ... }@inputs:
  let 
    username = "demeter";
    system = "x86_64-linux";
    pkgs = import nixpkgs {
      inherit system;
      overlays = [ nixgl.overlay ];
      config.allowUnfree = true;
    };
  in
  {
    homeConfigurations."${username}" = home-manager.lib.homeManagerConfiguration {
      inherit pkgs;
      extraSpecialArgs = { inherit inputs username pkgs; };
      modules = [ ./home-manager/home.nix ];
    };
  };
}
