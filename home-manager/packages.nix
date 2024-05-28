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
    linux = with pkgs; [
      (mpv.override {scripts = [mpvScripts.mpris];})
      spotify
      transmission_4-gtk
      gnome-secrets
      # yabridge
      # yabridgectl
      # wine-staging
      nodejs
    ];
    cli = with pkgs; [
      bat
      eza
      fd
      ripgrep
      fzf
      lazydocker
      lazygit
    ];
  in {
    linux = packagesType linux;
    cli = packagesType cli;
  };

  imports = [
    ./scripts/blocks.nix
    ./scripts/nx-switch.nix
    ./scripts/vault.nix
  ];

  config = {
    home.packages = with config.packages; if pkgs.stdenv.isLinux
      then cli ++ linux
      else cli;
  };
}
