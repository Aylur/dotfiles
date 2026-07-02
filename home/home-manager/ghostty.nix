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
  home.packages = [
    pkgs.ghostty
  ];

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
      background = "#F8F3ED";
      foreground = "#14110F";
      selection-background = "#7A3E00";
      selection-foreground = "#14110F";
      cursor-color = "#14110F";
      cursor-text = "#F8F3ED";
      palette = [
        "1=#8F1238"
        "9=#6E0E2B"
        "2=#005F3C"
        "10=#004C30"
        "3=#5A5400"
        "11=#464100"
        "4=#0055A6"
        "12=#00427F"
        "5=#4A2AA8"
        "13=#391F84"
        "6=#005C66"
        "14=#004851"
        "0=#E0E0E3"
        "8=#B8B8BE"
        "7=#232328"
        "15=#0A0A0C"
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
