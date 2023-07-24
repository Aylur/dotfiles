{ pkgs, ... }:
{
  imports = [
    ./starship.nix
    ./packages.nix
    ./sh.nix
    ./neofetch.nix
    ./desktopEntries.nix
    ./theming.nix
    ./files.nix
    ./hyprland.nix
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
      # BROWSER = "flatpak run org.mozilla.firefox";
      TERMINAL = "nixGL wezterm";
      XCURSOR_THEME = "Qogir";
      NIXPKGS_ALLOW_UNFREE = "1";
      SHELL = "${pkgs.zsh}/bin/zsh";
    };

    sessionPath = [
      "$HOME/.local/bin"
    ];

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
