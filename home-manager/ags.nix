{ inputs, pkgs, ... }:
{
  home.packages = with pkgs; [
    inputs.ags.packages.${system}.default
    (python311.withPackages (p: [ p.python-pam ]))
  ];

  xdg.configFile.ags.source = ../ags;
}
