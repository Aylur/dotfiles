{
  config,
  pkgs,
  ...
}: {
  imports = [
    ../../home/home-manager/browser.nix
    ../../home/home-manager/dconf.nix
    ../../home/home-manager/distrobox
    ../../home/home-manager/ghostty.nix
    ../../home/home-manager/git.nix
    ../../home/home-manager/hyprland.nix
    ../../home/home-manager/lf.nix
    ../../home/home-manager/nvim.nix
    ../../home/home-manager/packages.nix
    ../../home/home-manager/sh.nix
    ../../home/home-manager/starship.nix
    ../../home/home-manager/theme.nix
    ../../home/home-manager/tmux.nix
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
