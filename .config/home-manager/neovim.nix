{ pkgs, ... }:
{
  home.packages = with pkgs; [
    fzf ripgrep fd
    chafa ffmpegthumbnailer poppler_utils
    fontpreview xclip
  ];
  programs.neovim = {
    enable = false;
    defaultEditor = true;
    extraLuaPackages = luaPkgs: with pkgs; [ 
      luajitPackages.luautf8
    ];
    # plugins = with pkgs.vimPlugins; [
    # ];
  };
}
