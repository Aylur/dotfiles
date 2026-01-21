{pkgs ? import <nixpkgs> {}}:
with pkgs; let
  bins = [
    git
    gcc
    gnumake
    unzip
    wget
    curl
    tree-sitter
    ripgrep
    fd
    fzf
    cargo
    lazygit
    nodePackages.npm
    python3
    luajitPackages.luarocks
    lua51Packages.lua
    libxml2
    imagemagick

    # lua
    lua-language-server
    stylua

    # nix
    nil
    alejandra

    # bash
    shfmt

    # ts
    nodejs
    deno
    bun
    yarn
    pnpm
    nodePackages.npm
    nodePackages.prettier
    tailwindcss-language-server
    svelte-language-server
    astro-language-server
    vue-language-server
    vscode-langservers-extracted
    vtsls
    markdownlint-cli2
    marksman

    # go
    go
    gopls
    gotools
    gofumpt
    go-tools

    # python
    ruff
    pyright
    poetry
    uv

    # rust
    cargo
    rustc
    rustfmt
    rust-analyzer
    clippy

    # c
    clang-tools
    glib
  ];

  linuxBins =
    if pkgs.stdenv.isDarwin
    then []
    else [
      # vala
      vala-language-server
      mesonlsp
      blueprint-compiler
      meson
      pkg-config
      ninja
      uncrustify

      # clipboard
      wl-clipboard
      xsel
      xclip
    ];
in
  wrapNeovimUnstable neovim-unwrapped {
    withRuby = true;
    withNodeJs = true;
    withPython3 = true;
    wrapRc = false;
    wrapperArgs = lib.strings.concatStringsSep " " [
      ''--set SHELL ${lib.getExe pkgs.bash}''
      ''--suffix PATH : "${lib.makeBinPath (bins ++ linuxBins)}"''
    ];
  }
