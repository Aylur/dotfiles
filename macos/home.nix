{pkgs, ...}: {
  imports = [
    ../home-manager/git.nix
    ../home-manager/lf.nix
    ../home-manager/nvim.nix
    ../home-manager/sh.nix
    ../home-manager/starship.nix
    ../home-manager/tmux.nix
  ];

  news.display = "show";

  home.sessionVariables = {
    EDITOR = "nvim";
    SHELL = "${pkgs.nushell}/bin/nu";
  };

  xdg = {
    enable = true;
    configFile.wezterm.source = ../wezterm;
    configFile.test.text = "hello";
  };

  nix.settings = {
    experimental-features = ["nix-command" "flakes"];
    warn-dirty = false;
  };

  programs.home-manager.enable = true;
  home.stateVersion = "21.11";
}
