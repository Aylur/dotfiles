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

  gjs-wrapped = pkgs.stdenv.mkDerivation {
    name = "gjs";
    src = null;
    dontUnpack = true;
    nativeBuildInputs = with pkgs; [
      wrapGAppsHook
    ];
    buildInputs = with pkgs; [
      gjs
      glib
      libsoup_3
      gtk4
      gtk3
      gtk4-layer-shell
      gtk-layer-shell
      libadwaita
      gobject-introspection
    ];
    installPhase = ''
      mkdir -p $out/bin
      cp ${pkgs.gjs}/bin/gjs $out/bin/gjs
    '';
  };
in {
  home.packages = pkgs.lib.flatten (with pkgs; [
    scripts.lorem
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

      esbuild
      nodePackages.npm
      nodejs
      bun
      pnpm
      gjs-wrapped
      python3
    ])

    # (mkIf pkgs.stdenv.isDarwin [])
  ]);
}
