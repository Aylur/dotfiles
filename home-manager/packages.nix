{
  pkgs,
  config,
  lib,
  ...
}: let
  packagesType = with lib;
    def:
      mkOption {
        type = types.listOf types.package;
        default = def;
      };
in {
  options.packages = with lib; let
    host = with pkgs; [
      (mpv.override {scripts = [mpvScripts.mpris];})
      spotify
      transmission_4-gtk
      gnome-secrets
      # yabridge
      # yabridgectl
      # wine-staging
      nodejs
      lazydocker
      lazygit
    ];
    cli = with pkgs; [
      bat
      eza
      fd
      ripgrep
      fzf
    ];
  in {
    host = packagesType host;
    cli = packagesType cli;
  };

  imports = [
    ./scripts/blocks.nix
    ./scripts/nx-switch.nix
    ./scripts/vault.nix
  ];

  config = {
    home.packages = with config.packages; cli ++ host;
  };
}
