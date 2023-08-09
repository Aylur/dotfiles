{
  description = "Home Manager configuration of Aylur";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    nixgl.url = "github:guibou/nixGL";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { nixpkgs, nixgl,  home-manager,  ... }:
  let 
    username = "demeter";
    pkgs = import nixpkgs {
      system = "x86_64-linux";
      overlays = [ nixgl.overlay ];
      config.allowUnfree = true;
    };
  in
  {
    homeConfigurations."${username}" = home-manager.lib.homeManagerConfiguration {
      pkgs = pkgs;
      modules = [
        ./home.nix
        {
          home.username = username;
          home.homeDirectory = "/home/${username}";
        }
      ];
    };
  };
}
