{ pkgs, username, ... }:
let
  homeDirectory = "/home/${username}";
in
{
  imports = [
    ./ags.nix
    ./blackbox.nix
    ./browser.nix
    ./bspwm.nix
    ./dconf.nix
    ./git.nix
    ./hyprland.nix
    ./lf.nix
    ./mimelist.nix
    ./neofetch.nix
    ./neovim.nix
    ./packages.nix
    ./sh.nix
    ./starship.nix
    ./theme.nix
    ./tmux.nix
    ./wezterm.nix
  ];

  news.display = "show";

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
      BAT_THEME = "base16";
      GOPATH = "${homeDirectory}/.local/share/go";
      GOMODCACHE="${homeDirectory}/./go/pkg/mod";
    };

    sessionPath = [
      "$HOME/.local/bin"
    ];
  };

  gtk.gtk3.bookmarks = [
    "file://${homeDirectory}/Documents"
    "file://${homeDirectory}/Music"
    "file://${homeDirectory}/Pictures"
    "file://${homeDirectory}/Videos"
    "file://${homeDirectory}/Downloads"
    "file://${homeDirectory}/Desktop"
    "file://${homeDirectory}/Projects"
    "file://${homeDirectory}/Vault"
    "file://${homeDirectory}/Vault/School"
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
  home.stateVersion = "21.11";
}
