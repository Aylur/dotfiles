{
  pkgs,
  inputs,
  ...
}: let
  mkIf = cond: value:
    if cond
    then value
    else [];

  screenshot = pkgs.writers.writeNuBin "screenshot" {
    makeWrapperArgs = with pkgs; [
      "--prefix PATH : ${lib.makeBinPath [
        libnotify
        slurp
        wayshot
        swappy
        wl-clipboard
      ]}"
    ];
  } (builtins.readFile ../scripts/screenshot.nu);

  lorem =
    pkgs.writers.writeNuBin "lorem" {}
    (builtins.readFile ../scripts/lorem.nu);

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

  python = pkgs.python3.withPackages (p: [
    p.requests
  ]);
in {
  home.packages =
    [
      lorem
    ]
    ++ (with pkgs; [
      bat
      eza
      fd
      ripgrep
      fzf
      lazydocker
      lazygit
      btop
    ])
    ++ (
      mkIf pkgs.stdenv.isLinux (with pkgs; [
        inputs.icon-browser.packages.${pkgs.system}.default
        inputs.nix-search.packages.${pkgs.system}.default
        screenshot

        (mpv.override {scripts = [mpvScripts.mpris];})
        spotify
        fragments
        # yabridge
        # yabridgectl
        # wine-staging

        esbuild
        nodePackages.npm
        nodejs
        pnpm
        yarn
        gjs-wrapped

        python
        uv
        poetry
      ])
    );
}
