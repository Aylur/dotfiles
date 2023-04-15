{ config, pkgs, lib, ... }:
{
  imports = [
    ./starship.nix
    ./packages.nix
    ./helix.nix
    ./sh.nix
    ./hyprland.nix
    ./neofetch.nix
    ./desktopEntries.nix
    ./theming.nix
    # ./files.nix
  ];

  nixpkgs.config.allowUnfree = true;
  nix.settings.experimental-features = [ "nix-command" "flakes" ];
  nix.package = pkgs.nix;

  targets.genericLinux.enable = true;
  
  home = {
    sessionVariables = {
      QT_XCB_GL_INTEGRATION = "none"; # kde-connect
      EDITOR = "nvim";
      VISUAL = "code";
      XCURSOR_THEME = "Qogir";
      NIXPKGS_ALLOW_UNFREE = "1";
    };

    username = "demeter";
    homeDirectory = "/home/demeter";
    stateVersion = "21.11";
  };

  services = {
    kdeconnect = {
      enable = true;
      indicator = true;
    };
  };

  programs = { home-manager.enable = true; };
}
