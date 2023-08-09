{
  description = "Home Manager configuration of Aylur";

  inputs = {
    nixpkgs = {
      url = "github:nixos/nixpkgs/nixos-unstable";
    };
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { nixpkgs,  home-manager,  ... }:
  let 
    username = "demeter";
    system = "x86_64-linux";
    pkgs = import nixpkgs {
      inherit system;
      config.allowUnfree = true;
    };
  in
  {
    homeConfigurations."${username}" = home-manager.lib.homeManagerConfiguration {
      pkgs = pkgs;
      modules = [
        ./.config/home-manager/home.nix
        {
          home.username = username;
          home.homeDirectory = "/home/${username}";
        }
      ];
    };
  };
}
