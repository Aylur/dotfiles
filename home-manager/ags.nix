{ inputs, pkgs, ... }:
let
  config = pkgs.callPackage ../ags { inherit inputs; };
in
{
  imports = [ inputs.ags.homeManagerModules.default ];

  home.packages = with pkgs; [
    inputs.matugen.packages.${pkgs.system}.default
    dart-sass
    gtk3 # gtk-launch
  ];

  programs.ags = {
    enable = true;
    configDir = config.config;
    extraPackages = with pkgs; [
      accountsservice
    ];
  };
}
