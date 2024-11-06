{
  inputs,
  pkgs,
  ...
}: {
  imports = [inputs.ags.homeManagerModules.default];

  programs.ags = {
    enable = true;
    package = inputs.ags.packages.${pkgs.system}.agsFull;
    # configDir = ../ags;

    extraPackages = with pkgs; [
      fzf
    ];
  };
}
