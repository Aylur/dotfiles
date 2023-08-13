{
  description = "Home Manager configuration of Aylur";

  inputs = {
    nixgl.url = "github:guibou/nixGL";
    ags.url = "github:Aylur/ags";
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { nixpkgs, nixgl,  home-manager,  ... }@inputs:
  let 
    hostname = "demeter";
    system = "x86_64-linux";
    pkgs = import nixpkgs {
      inherit system;
      overlays = [ nixgl.overlay ];
      config.allowUnfree = true;
    } // {
        ags = inputs.ags.packages.${system}.default;
    };
  in
  {
    homeConfigurations."${hostname}" = home-manager.lib.homeManagerConfiguration {
      inherit pkgs;
      extraSpecialArgs = { inherit inputs hostname pkgs; };
      modules = [ ./home.nix ];
    };
  };
}
