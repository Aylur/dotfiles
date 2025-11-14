{
  imports = [
    ../../../home
    ./hyprland.nix
    ./packages.nix
    ./theme.nix
  ];

  news.display = "show";
  programs.home-manager.enable = true;
  home.stateVersion = "21.11";
}
