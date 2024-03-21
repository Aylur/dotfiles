{
  description = "Configurations of Aylur";

  outputs = inputs@{ self, home-manager, nix-darwin, nixpkgs, ... }: {
    packages.x86_64-linux.default =
      nixpkgs.legacyPackages.x86_64-linux.callPackage ./ags {inherit inputs;};

    # nixos config
    nixosConfigurations = {
      "nixos" = let
        hostname = "nixos";
        username = "demeter";
      in
      nixpkgs.lib.nixosSystem rec {
        system = "x86_64-linux";
        specialArgs = {
          inherit inputs;
          asztal = self.packages.x86_64-linux.default;
        };
        modules = [
          ./nixos/nixos.nix
          home-manager.nixosModules.home-manager
          {
            users.users.${username} = {
              isNormalUser = true;
              initialPassword = username;
              extraGroups = [
                "nixosvmtest"
                "networkmanager"
                "wheel"
                "audio"
                "video"
                "libvirtd"
                "docker"
              ];
            };
            networking.hostName = hostname;
            home-manager = {
              useGlobalPkgs = true;
              useUserPackages = true;
              extraSpecialArgs = specialArgs;
              users.${username} = {
                home.username = username;
                home.homeDirectory = "/home/${username}";
                imports = [./nixos/home.nix];
              };
            };
          }
        ];
      };
    };

    # nixos hm config
    homeConfigurations = let
      username = "demeter";
    in {
      "${username}" = home-manager.lib.homeManagerConfiguration {
        pkgs = import nixpkgs {
          system = "x86_64-linux";
          config.allowUnfree = true;
        };
        extraSpecialArgs = {
          inherit inputs;
          asztal = self.packages.x86_64-linux.default;
        };
        modules = [
          ./nixos/home.nix
          ({ pkgs, ... }: {
            nix.package = pkgs.nix;
            home = {
              packages = [(pkgs.writeShellScriptBin "hm" ''
                ${./symlink.nu} -r
                home-manager switch --flake .
                ${./symlink.nu} -a
              '')];
              username = username;
              homeDirectory = "/home/${username}";
            };
          })
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
              extraSpecialArgs = { inherit inputs; };
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
