{ pkgs, ... }: let
  nv = pkgs.writeShellScriptBin "nv" ''
    ${pkgs.steam-run}/bin/steam-run ${pkgs.neovim}/bin/nvim $@
  '';
  deps = with pkgs; with nodePackages_latest; [
    gjs
    typescript
    eslint
    go
    python3
    nodejs
    cargo
    gcc13
    gnumake
    unzip
    wget
    curl
    tree-sitter
    luajitPackages.luarocks
    python311Packages.pynvim
    php82Packages.composer
    python311Packages.pip
  ];
in {
  home = {
    packages = [nv] ++ deps;
    sessionVariables = {
      EDITOR = "nvim";
      VISUAL = "nvim";
    };
  };

  xdg.desktopEntries."nvim" = {
    name = "NeoVim";
    comment = "Edit text files";
    icon = "nvim";
    # xterm is a symlink and not actually xterm
    exec = "xterm -e ${nv}/bin/nvim %F";
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

    extraPackages = deps;
  };

  xdg.configFile.nvim.source = ../nvim;
}
