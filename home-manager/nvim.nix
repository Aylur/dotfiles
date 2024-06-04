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
