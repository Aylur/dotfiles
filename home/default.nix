{config, ...}: {
  imports = [
    ./home-manager/distrobox
    ./home-manager/browser.nix
    ./home-manager/cli.nix
    ./home-manager/dconf.nix
    ./home-manager/ghostty.nix
  ];

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
}
