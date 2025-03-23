{pkgs ? import <nixpkgs> {}}:
with pkgs; let
  extraPackages = [
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

    nil
    lua-language-server
    stylua
    alejandra
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

    # vala
    vala-language-server
    mesonlsp
    blueprint-compiler
    meson
    pkg-config
    ninja

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
  ];
in
  wrapNeovimUnstable neovim-unwrapped {
    # viAlias = true;
    # vimAlias = true;
    withRuby = true;
    withNodeJs = true;
    withPython3 = true;
    wrapRc = false;
    # luaRcContent = "print('hello')";
    wrapperArgs = ''--suffix PATH : "${lib.makeBinPath extraPackages}"'';
  }
