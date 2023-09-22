{ pkgs, username, ... }:
let
  homeDirectory = "/home/${username}";
in
{
  imports = [
    ./ags.nix
    ./browser.nix
    ./dconf.nix
    ./git.nix
    ./hyprland.nix
    ./neofetch.nix
    ./neovim.nix
    ./packages.nix
    ./sh.nix
    ./starship.nix
    ./theme.nix
    ./wezterm.nix
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
    inherit username homeDirectory;

    sessionVariables = {
      QT_XCB_GL_INTEGRATION = "none"; # kde-connect
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
    "file://${homeDirectory}/Vault Vault"
    "file://${homeDirectory}/Vault/School School"
    "file://${homeDirectory}/.config Config"
    "file://${homeDirectory}/.local/share Local"
  ];

  services = {
    kdeconnect = {
      enable = true;
      indicator = true;
    };
  };

  programs.home-manager.enable = true;
}
