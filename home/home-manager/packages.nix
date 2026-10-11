{
  pkgs,
  inputs,
  ...
}: let
  unstable-pkgs = import inputs.nixpkgs-unstable {
    inherit (pkgs.stdenv.hostPlatform) system;
    inherit (pkgs) config;
  };

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
  home.packages = [
    unstable-pkgs.claude-code
    (import ../nvim {pkgs = unstable-pkgs;})

    pkgs.gettext
    pkgs.glib.dev

    # dev
    pkgs.nodejs_24
    pkgs.bun
    pkgs.deno
    pkgs.esbuild
    pkgs.pnpm
    pkgs.yarn
    gjs-wrapped
    python-wrapped
    pkgs.uv
    pkgs.poetry
    pkgs.gcc
    pkgs.rustup
    pkgs.go
    pkgs.clang-tools

    # cli
    pkgs.imagemagick
    pkgs.tmux
    pkgs.nushell
    pkgs.starship
    pkgs.bat
    pkgs.eza
    pkgs.fd
    pkgs.ripgrep
    pkgs.fzf
    pkgs.lazydocker
    pkgs.lazygit
    pkgs.btop
    pkgs.libnotify

    # music
    pkgs.yabridge
    pkgs.yabridgectl
    pkgs.wine-staging

    # themes
    pkgs.adw-gtk3
    pkgs.yaru-theme

    # icons
    pkgs.qogir-icon-theme
    pkgs.morewaita-icon-theme
    pkgs.papirus-icon-theme

    # fonts
    pkgs.nerd-fonts.caskaydia-cove
    pkgs.nerd-fonts.ubuntu

    # apps
    (pkgs.mpv.override {scripts = [pkgs.mpvScripts.mpris];})
  ];
}
