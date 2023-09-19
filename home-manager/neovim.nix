{ pkgs, ... }:
{
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

    extraPackages = with pkgs; [
      stylua
      cargo
      gcc13
      unzip
      wget
      curl
      tree-sitter
      luajitPackages.luarocks
      python311Packages.pynvim
      php82Packages.composer
      python311Packages.pip
      chafa
      ffmpegthumbnailer
      poppler_utils
      fontpreview
      xclip
    ];
  };

  xdg.configFile.nvim.source = ../nvim;
}
