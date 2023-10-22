{ inputs, pkgs, ... }:
let
  ags = inputs.ags.packages.${pkgs.system}.default;
  override = (_: prev: {
    buildInputs = with pkgs; prev.buildInputs ++ [
      # libadwaita
      libsoup_3
    ];
  });
in
{
  home.packages = with pkgs; [
    (ags.overrideAttrs override)
    (python311.withPackages (p: [ p.python-pam ]))
  ];

  xdg.configFile.ags.source = ../ags;
}
