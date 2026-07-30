{pkgs, ...}: let
  bins = with pkgs; [
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
    nodejs
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
    pnpm
    prettier
    oxfmt
    oxlint
    tailwindcss-language-server
    svelte-language-server
    astro-language-server
    vue-language-server
    vscode-langservers-extracted
    typescript-language-server
    typescript
    typescript-go
    vtsls

    # markdown
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
    uv

    # rust
    cargo
    rustfmt
    rust-analyzer
    clippy

    # c
    clang-tools
    glib
  ];

  linuxBins = with pkgs;
    if stdenv.isDarwin
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
  pkgs.wrapNeovimUnstable pkgs.neovim-unwrapped {
    withRuby = true;
    withNodeJs = true;
    withPython3 = true;
    wrapRc = false;
    wrapperArgs = pkgs.lib.strings.concatStringsSep " " [
      # ''--set SHELL ${lib.getExe pkgs.bash}''
      ''--suffix PATH : "${pkgs.lib.makeBinPath (bins ++ linuxBins)}"''
    ];
  }
