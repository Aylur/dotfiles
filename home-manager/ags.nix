{ inputs, pkgs, ... }:
{
  home.packages = [
    inputs.ags.packages.${pkgs.system}.default
  ];

  xdg.configFile.ags.source = ../ags;
}
