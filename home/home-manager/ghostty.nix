{pkgs, ...}: let
  gen = pkgs.lib.generators;

  values = gen.toKeyValue {
    listsAsDuplicateKeys = true;
    mkKeyValue = gen.mkKeyValueDefault {} " = ";
  };

  files = files:
    pkgs.symlinkJoin {
      name = "ghostty";
      paths =
        builtins.map
        (path: pkgs.writeTextDir path files.${path})
        (builtins.attrNames files);
    };
in {
  xdg.configFile."ghostty".source = files {
    "config" = values {
      command = "tmux";
      font-family = "CaskaydiaCove Nerd Font";
      font-feature = ["liga" "calt"];
      theme = "light:nucharm-light,dark:nucharm-dark";
      window-padding-x = 12;
      window-padding-y = 6;
      window-decoration = "auto";
      window-theme = "system";
      window-height = 26;
      window-width = 90;
      copy-on-select = true;
      gtk-single-instance = false;
      gtk-titlebar = false;
      confirm-close-surface = false;
      keybind = [
        "alt+one=unbind"
        "alt+two=unbind"
        "alt+three=unbind"
        "alt+four=unbind"
        "ctrl+shift+minus=decrease_font_size:1"
        "ctrl+shift+minus=decrease_font_size:1"
      ];
    };
    "themes/nucharm-light" = values {
      background = "#fffaf0";
      foreground = "#151515";
      selection-background = "#824b14";
      selection-foreground = "#1a1110";
      cursor-color = "#151515";
      cursor-text = "#fefefa";
      palette = [
        "1=#a82238"
        "9=#941e31"
        "2=#14634c"
        "10=#0e4737"
        "3=#615907"
        "11=#4f4906"
        "4=#1d5b8f"
        "12=#174973"
        "5=#5d4b96"
        "13=#483b75"
        "6=#11635d"
        "14=#0d4f4b"
        "0=#afafb0"
        "8=#bdbebf"
        "7=#3b3c3d"
        "15=#2d2d2e"
      ];
    };
    "themes/nucharm-dark" = values {
      background = "#151519";
      foreground = "#b2b5b3";
      selection-background = "#ebff71";
      selection-foreground = "#313234";
      cursor-color = "#eaeaea";
      cursor-text = "#373839";
      palette = [
        "1=#e55f86"
        "9=#d15577"
        "2=#00d787"
        "10=#43c383"
        "3=#ebff71"
        "11=#d8e77b"
        "4=#50a4e7"
        "12=#4886c8"
        "5=#9076e7"
        "13=#8861dd"
        "6=#50e6e6"
        "14=#43c3c3"
        "0=#373839"
        "8=#313234"
        "7=#e7e7e7"
        "15=#c1c4c2"
      ];
    };
  };
}
