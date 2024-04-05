{
  pkgs,
  lib,
  ...
}: let
  ifLinux = lib.mkIf pkgs.stdenv.isLinux;

  deps = with pkgs;
  with nodePackages_latest; [
    # js, html
    vscode-html-languageserver-bin
    vscode-langservers-extracted
    tailwindcss-language-server
    typescript-language-server
    svelte-language-server
    eslint
    typescript
    nodePackages_latest."@astrojs/language-server"

    # markup
    marksman
    markdownlint-cli
    taplo # toml
    yaml-language-server

    # python
    ruff
    ruff-lsp
    pyright

    # bash
    shfmt
    bash-language-server

    nushell
  ];
in {
  xdg = {
    configFile.nvim.source = ../nvim;
    desktopEntries."nvim" = ifLinux {
      name = "NeoVim";
      comment = "Edit text files";
      icon = "nvim";
      exec = "xterm -e ${pkgs.neovim}/bin/nvim %F";
      categories = ["TerminalEmulator"];
      terminal = false;
      mimeType = ["text/plain"];
    };
  };

  home.sessionVariables = {
    EDITOR = "nvim";
    VISUAL = "nvim";
  };

  programs.neovim = {
    enable = true;
    viAlias = true;
    vimAlias = true;

    withRuby = true;
    withNodeJs = true;
    withPython3 = true;

    extraPackages = with pkgs;
      [
        git
        nil
        lua-language-server
        gcc
        gnumake
        unzip
        wget
        curl
        tree-sitter
        ripgrep
        fd
        fzf
      ]
      ++ deps;
  };
}
