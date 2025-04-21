{
  pkgs,
  inputs,
  ...
}: let
  mkIf = cond: value:
    if cond
    then value
    else [];

  scripts = import ../scripts pkgs;
in {
  home.packages = pkgs.lib.flatten (with pkgs; [
    scripts.lorem
    scripts.blocks
    bat
    eza
    fd
    ripgrep
    fzf
    lazydocker
    lazygit
    btop

    (mkIf pkgs.stdenv.isLinux [
      (mpv.override {scripts = [mpvScripts.mpris];})
      spotify
      fragments
      # figma-linux
      inputs.icon-browser.packages.${pkgs.system}.default
      # yabridge
      # yabridgectl
      # wine-staging
    ])

    # (mkIf pkgs.stdenv.isDarwin [])
  ]);
}
