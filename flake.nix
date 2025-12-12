{
  outputs = inputs: {
    nixosConfigurations = {
      "nixos" = import ./system/nixos inputs;
    };
  };

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-25.11";
    home-manager = {
      url = "github:nix-community/home-manager/release-25.11";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    vault = {
      url = "git+ssh://git@github.com/aylur/vault";
      flake = false;
    };
    marble-shell = {
      url = "git+ssh://git@github.com/Aylur/marble-shell";
    };
    icon-browser = {
      url = "github:Aylur/icon-browser";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    battery-notifier = {
      url = "github:Aylur/battery-notifier";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    lf = {
      url = "github:gokcehan/lf";
      flake = false;
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
