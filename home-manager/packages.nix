{pkgs, ...}: let
  mkIf = cond: value:
    if cond
    then value
    else [];
in {
  home.packages = pkgs.lib.flatten (with pkgs; [
    bat
    eza
    fd
    ripgrep
    fzf
    lazydocker
    lazygit
    btop

    ((import ../scripts pkgs).blocks)

    (mkIf pkgs.stdenv.isLinux [
      (mpv.override {scripts = [mpvScripts.mpris];})
      spotify
      fragments
      figma-linux
      # yabridge
      # yabridgectl
      # wine-staging
    ])

    # (mkIf pkgs.stdenv.isDarwin [])
  ]);
}
