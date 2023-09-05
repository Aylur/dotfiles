{ pkgs, hostname, ... }:
let
  homeDirectory = "/home/${hostname}";
in
{
  imports = [
    ./browser.nix
    ./terminal.nix
    ./hyprland.nix
    ./neofetch.nix
    ./packages.nix
    ./starship.nix
    ./theme.nix
  ];

  targets.genericLinux.enable = true;

  nix = {
    package = pkgs.nix;
    settings = {
      experimental-features = [ "nix-command" "flakes" ];
      warn-dirty = false;
    };
  };

  home = {
    username = hostname;
    homeDirectory = homeDirectory;

    sessionVariables = {
      QT_XCB_GL_INTEGRATION = "none"; # kde-connect
      EDITOR = "nvim";
      VISUAL = "nvim";
      TERMINAL = "nixGL wezterm";
      XCURSOR_THEME = "Qogir";
      NIXPKGS_ALLOW_UNFREE = "1";
      SHELL = "${pkgs.zsh}/bin/zsh";
    };

    sessionPath = [
      "$HOME/.local/bin"
    ];

    stateVersion = "21.11";
  };

  gtk.gtk3.bookmarks = [
    "file://${homeDirectory}/Documents"
    "file://${homeDirectory}/Music"
    "file://${homeDirectory}/Pictures"
    "file://${homeDirectory}/Videos"
    "file://${homeDirectory}/Downloads"
    "file://${homeDirectory}/Projects Projects"
    "file://${homeDirectory}/School School"
    "file://${homeDirectory}/.config Config"
    "file://${homeDirectory}/.local/share Local"
  ];

  services = {
    kdeconnect = {
      enable = true;
      indicator = true;
    };
  };

  programs = { home-manager.enable = true; };
}
