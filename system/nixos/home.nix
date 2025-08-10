{
  config,
  pkgs,
  ...
}: {
  imports = [
    ../../home/browser.nix
    ../../home/dconf.nix
    ../../home/distrobox
    ../../home/ghostty.nix
    ../../home/git.nix
    ../../home/hyprland.nix
    ../../home/lf.nix
    ../../home/nvim.nix
    ../../home/packages.nix
    ../../home/sh.nix
    ../../home/starship.nix
    ../../home/theme.nix
    ../../home/tmux.nix
  ];

  news.display = "show";

  home = {
    sessionVariables = {
      QT_XCB_GL_INTEGRATION = "none"; # kde-connect
      NIXPKGS_ALLOW_UNFREE = "1";
      NIXPKGS_ALLOW_INSECURE = "1";
      BAT_THEME = "base16";
      PAGER = "${pkgs.bat}/bin/bat";
      GOPATH = "${config.home.homeDirectory}/.local/share/go";
      GOMODCACHE = "${config.home.homeDirectory}/.cache/go/pkg/mod";
    };

    sessionPath = [
      "${config.home.homeDirectory}/.local/bin"
    ];
  };

  xdg.configFile."gtk-3.0/bookmarks".text = let
    home = config.home.homeDirectory;
  in ''
    file://${home}/Projects
    file://${home}/Work
    file://${home}/Desktop
    file://${home}/Downloads
    file://${home}/Documents
    file://${home}/.config Config
    file://${home}/Vault
    file://${home}/Pictures
    file://${home}/Music
    file://${home}/Videos
  '';

  programs.home-manager.enable = true;
  home.stateVersion = "21.11";
}
