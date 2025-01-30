{scheme ? "dark"}: let
  schemes = {
    dark = {
      bg = "#151515";
      fg = "#b2b5b3";

      selection = {
        bg = "#EBFF71";
        fg = "#313234";
      };

      cursor = {
        bg = "#eaeaea";
        fg = "#373839";
      };

      black = "#373839";
      red = "#e55f86";
      green = "#00D787";
      yellow = "#EBFF71";
      blue = "#50a4e7";
      magenta = "#9076e7";
      cyan = "#50e6e6";
      pink = "#e781d6";
      white = "#e7e7e7";

      bright = {
        black = "#313234";
        red = "#d15577";
        green = "#43c383";
        yellow = "#d8e77b";
        blue = "#4886c8";
        magenta = "#8861dd";
        cyan = "#43c3c3";
        pink = "#d76dc5";
        white = "#c1c4c2";
      };
    };

    light = {
      fg = "#171717";
      bg = "#fafafa";

      selection = {
        bg = "#f6d32d";
        fg = "#313234";
      };

      cursor = {
        bg = "#171717";
        fg = "#fafafa";
      };

      black = "#afafb0";
      red = "#f66151";
      green = "#33d17a";
      yellow = "#f6d32d";
      blue = "#62a0ea";
      magenta = "#9141ac";
      cyan = "#47b496";
      white = "#3b3c3d";

      bright = {
        black = "#bdbebf";
        red = "#dd5742";
        green = "#29bd6b";
        yellow = "#ddbf23";
        blue = "#5891d6";
        magenta = "#82379d";
        cyan = "#3da087";
        white = "#2d2d2e";
      };
    };
  };

  colors = schemes.${scheme};
in
  colors
  // {
    ansi = with colors; [
      black
      red
      green
      yellow
      blue
      magenta
      cyan
      white
    ];
    bright_ansi = with colors; [
      bright.black
      bright.red
      bright.green
      bright.yellow
      bright.blue
      bright.magenta
      bright.cyan
      bright.white
    ];
  }
