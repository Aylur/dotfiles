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
      selection-background = "#9d7309";
      selection-foreground = "#1a1110";
      cursor-color = "#151515";
      cursor-text = "#fefefa";
      palette = [
        "0=#afafb0"
        "1=#7c0902"
        "2=#1b4d3e"
        "3=#9d7309"
        "4=#273b74"
        "5=#4b0082"
        "6=#01796f"
        "7=#3b3c3d"
        "8=#bdbebf"
        "9=#660000"
        "10=#013220"
        "11=#906908"
        "12=#1f305e"
        "13=#450076"
        "14=#017167"
        "15=#2d2d2e"
      ];
    };
    "themes/nucharm-dark" = values {
      background = "#151519";
      foreground = "#b2b5b3";
      selection-background = "#EBFF71";
      selection-foreground = "#313234";
      cursor-color = "#eaeaea";
      cursor-text = "#373839";
      palette = [
        "0=#373839"
        "1=#e55f86"
        "2=#00d787"
        "3=#ebff71"
        "4=#50a4e7"
        "5=#9076e7"
        "6=#50e6e6"
        "7=#e7e7e7"
        "8=#313234"
        "9=#d15577"
        "10=#43c383"
        "11=#d8e77b"
        "12=#4886c8"
        "13=#8861dd"
        "14=#43c3c3"
        "15=#c1c4c2"
      ];
    };
  };
}
