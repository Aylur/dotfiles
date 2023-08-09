{ pkgs, ... }:
{
  imports = [
    ./browser.nix
    ./desktopEntries.nix
    ./hyprland.nix
    ./neofetch.nix
    ./nerdfonts.nix
    ./packages.nix
    ./sh.nix
    ./starship.nix
    ./theme.nix
  ];

  home.packages = [
    (import ./colorscript.nix { inherit pkgs; })
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
    "file:///home/demeter/Documents"
    "file:///home/demeter/Music"
    "file:///home/demeter/Pictures"
    "file:///home/demeter/Videos"
    "file:///home/demeter/Downloads"
    "file:///home/demeter/Projects Projects"
    "file:///home/demeter/School School"
  ];

  services = {
    kdeconnect = {
      enable = true;
      indicator = true;
    };
  };

  programs = { home-manager.enable = true; };
}
