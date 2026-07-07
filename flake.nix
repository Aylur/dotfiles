{
  outputs = inputs: let
    forAllSystems = inputs.nixpkgs.lib.genAttrs [
      "x86_64-linux"
      "x86_64-darwin"
    ];
  in {
    packages = forAllSystems (system: {
      nvim = import ./home/nvim inputs;
    });

    nixosConfigurations = {
      "nixos" = import ./system/nixos inputs;
    };
  };

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-26.05";
    nixpkgs-unstable.url = "github:nixos/nixpkgs/nixos-unstable";

    home-manager = {
      url = "github:nix-community/home-manager/release-26.05";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    vault = {
      url = "git+ssh://git@github.com/aylur/vault";
      flake = false;
    };
    astal = {
      url = "github:aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    marble = {
      url = "/home/demeter/Projects/marble/";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    firefox-gnome-theme = {
      url = "github:rafaelmardojai/firefox-gnome-theme";
      flake = false;
    };
    solaar = {
      url = "github:Svenum/Solaar-Flake/main";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };
}
