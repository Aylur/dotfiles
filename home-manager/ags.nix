{ inputs, pkgs, asztal, ... }:
{
  imports = [ inputs.ags.homeManagerModules.default ];

  home.packages = with pkgs; [
    inputs.matugen.packages.${pkgs.system}.default
    dart-sass
    gtk3 # gtk-launch
  ];

  programs.ags = {
    enable = true;
    configDir = asztal.desktop.config;
    extraPackages = with pkgs; [
      accountsservice
    ];
  };
}
