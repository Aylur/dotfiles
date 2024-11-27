{pkgs, ...}: let
  nx = import ./scripts/nx.nix pkgs;
  blocks = import ./scripts/blocks.nix pkgs;
  vault = import ./scripts/vault.nix pkgs;
in {
  imports = [./modules/packages.nix];

  packages = with pkgs; {
    linux = [
      (mpv.override {scripts = [mpvScripts.mpris];})
      spotify
      fragments
      figma-linux
      # yabridge
      # yabridgectl
      # wine-staging

      blocks
      vault
      nx.switch
      nx.test
      nx.gc
    ];
    cli = [
      bat
      eza
      fd
      ripgrep
      fzf
      lazydocker
      lazygit
      btop
    ];
  };
}
