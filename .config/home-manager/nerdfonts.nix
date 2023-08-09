{ pkgs, ... }:
let
  nerdfonts = (pkgs.nerdfonts.override { fonts = [
      "Ubuntu"
      "UbuntuMono"
      "CascadiaCode"
      "FantasqueSansMono"
      "FiraCode"
      "VictorMono"
      "Mononoki"
  ]; });
in
{
  home.packages = [
    nerdfonts
  ];

  home.file = {
    ".local/share/fonts" = {
      recursive = true;
      source = "${nerdfonts}/share/fonts/truetype/NerdFonts";
    };
    ".fonts" = {
      recursive = true;
      source = "${nerdfonts}/share/fonts/truetype/NerdFonts";
    };
  };
}
