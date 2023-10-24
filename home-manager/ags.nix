{ inputs, pkgs, ... }:
{
  imports = [ inputs.ags.homeManagerModules.default ];

  programs.ags = {
    enable = true;
    configDir = ../ags;
    extraPackages = [ pkgs.libsoup_3 ];
  };
}
