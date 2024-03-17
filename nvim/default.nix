{ pkgs, ... }: let
  deps = with pkgs; with nodePackages_latest; [
    vscode-langservers-extracted
    tailwindcss-language-server
    typescript-language-server
    marksman
    markdownlint-cli
    eslint
    taplo
    typescript
    yaml-language-server
    bash-language-server
  ];
in {
  xdg.configFile.nvim.source = ./.;

  home.sessionVariables = {
    EDITOR = "nvim";
    VISUAL = "nvim";
  };

  xdg.desktopEntries."nvim" = {
    name = "NeoVim";
    comment = "Edit text files";
    icon = "nvim";
    # xterm is a symlink and not actually xterm
    exec = "xterm -e ${pkgs.neovim}/bin/nvim %F";
    categories = [ "TerminalEmulator" ];
    terminal = false;
    mimeType = [ "text/plain" ];
  };

  programs.neovim = {
    enable = true;
    viAlias = true;
    vimAlias = true;

    withRuby = true;
    withNodeJs = true;
    withPython3 = true;

    extraPackages = with pkgs; [
      nil
      lua-language-server
      gcc13
      gnumake
      unzip
      wget
      curl
      tree-sitter
    ] ++ deps;
  };
}
