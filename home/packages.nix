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
      wrapGAppsHook4
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

  python-wrapped = let
    python = pkgs.python3.withPackages (p: [
      p.requests
      p.pygobject3
    ]);
  in
    pkgs.stdenv.mkDerivation {
      name = "python";
      src = null;
      dontUnpack = true;
      nativeBuildInputs = with pkgs; [
        wrapGAppsHook4
      ];
      buildInputs = with pkgs; [
        python
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
        cp ${python}/bin/python3 $out/bin/python
      '';
    };
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
      mkIf pkgs.stdenv.isLinux [
        pkgs.imagemagick
        inputs.icon-browser.packages.${pkgs.system}.default
        inputs.nix-search.packages.${pkgs.system}.default
        screenshot

        (pkgs.mpv.override {scripts = [pkgs.mpvScripts.mpris];})
        pkgs.spotify
        pkgs.fragments
        # yabridge
        # yabridgectl
        # wine-staging

        pkgs.nodejs
        pkgs.bun
        pkgs.deno
        pkgs.esbuild
        pkgs.nodePackages.npm
        pkgs.pnpm
        pkgs.yarn
        gjs-wrapped

        python-wrapped
        pkgs.uv
        pkgs.poetry

        pkgs.gcc
        pkgs.cargo
        pkgs.rustc
        pkgs.go
        pkgs.clang-tools
      ]
    );
}
