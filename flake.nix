{
  description = "Configurations of Aylur";

  outputs = inputs @ {
    self,
    home-manager,
    nix-darwin,
    nixpkgs,
    ...
  }: {
    formatter = {
      x86_64-linux = nixpkgs.legacyPackages.x86_64-linux.alejandra;
      x86_64-darwin = nixpkgs.legacyPackages.x86_64-darwin.alejandra;
    };

    packages.x86_64-linux.default =
      nixpkgs.legacyPackages.x86_64-linux.callPackage ./ags {inherit inputs;};

    # nixos config
    nixosConfigurations = {
      "nixos" = let
        hostname = "nixos";
      in
        nixpkgs.lib.nixosSystem {
          system = "x86_64-linux";
          specialArgs = {
            inherit inputs;
            asztal = self.packages.x86_64-linux.default;
          };
          modules = [
            ./nixos/nixos.nix
            home-manager.nixosModules.home-manager
            {networking.hostName = hostname;}
          ];
        };
    };

    # macos
    darwinConfigurations = {
      "macos" = let
        username = "demeter";
      in
        nix-darwin.lib.darwinSystem {
          modules = [
            ./macos/macos.nix
            home-manager.darwinModules.home-manager
            {
              users.users.${username} = {
                name = username;
                home = "/Users/${username}";
              };
              home-manager = {
                useGlobalPkgs = true;
                useUserPackages = true;
                extraSpecialArgs = {inherit inputs;};
                users."${username}" = {
                  home.username = username;
                  home.homeDirectory = "/Users/${username}";
                  imports = [./macos/home.nix];
                };
              };
              networking = {
                hostName = "macos";
                computerName = "macos";
              };
            }
          ];
        };
    };
  };

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    nix-darwin = {
      url = "github:LnL7/nix-darwin";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    hyprland.url = "git+https://github.com/hyprwm/Hyprland?submodules=1";

    hyprland-plugins = {
      url = "github:hyprwm/hyprland-plugins";
      inputs.hyprland.follows = "hyprland";
    };

    hyprland-hyprspace = {
      url = "github:KZDKM/Hyprspace";
      inputs.hyprland.follows = "hyprland";
    };

    matugen.url = "github:InioX/matugen?ref=v2.2.0";
    ags.url = "github:Aylur/ags";
    astal.url = "github:Aylur/astal";

    lf-icons = {
      url = "github:gokcehan/lf";
      flake = false;
    };

    firefox-gnome-theme = {
      url = "github:rafaelmardojai/firefox-gnome-theme";
      flake = false;
    };

    turtle-git = {
      url = "git+https://gitlab.gnome.org/philippun1/turtle";
      flake = false;
    };
  };
}
