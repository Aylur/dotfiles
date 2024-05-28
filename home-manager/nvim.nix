{
  pkgs,
  lib,
  ...
}: let
  deps =
    if pkgs.stdenv.isLinux
    then
      with pkgs;
      with nodePackages_latest; [
        nil
        lua-language-server
        stylua
        alejandra

        # js, html
        vscode-html-languageserver-bin
        vscode-langservers-extracted
        tailwindcss-language-server
        typescript-language-server
        svelte-language-server
        eslint
        typescript
        nodePackages_latest."@astrojs/language-server"
        stylelint

        # markup
        marksman
        markdownlint-cli
        taplo # toml
        yaml-language-server

        # python
        ruff
        ruff-lsp
        pyright

        # sh
        shfmt
        bash-language-server
        nushell

        # c
        clang-tools

        # vala
        vala
        vala-language-server
        vala-lint
      ]
    else [];
in {
  xdg = {
    configFile.nvim.source = ../nvim;
    desktopEntries."nvim" = lib.mkIf pkgs.stdenv.isLinux {
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
      deps
      ++ [
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
      ];
  };
}
