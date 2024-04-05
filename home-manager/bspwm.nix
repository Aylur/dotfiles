# I don't actually use bpswm
# I just need an x11 window manager to test things
{pkgs, ...}: {
  home.file.".xinitrc".text = "bspwm";
  xsession.windowManager.bspwm = {
    enable = true;

    startupPrograms = ["sxhkd"];

    monitors = rec {
      eDP-1 = ["1" "2" "3" "4" "5"];
      HDMI-A-1 = eDP-1;
    };

    settings = {
      border_width = 2;
      window_gap = 12;
      split_ratio = 0.52;
      gapless_monocle = true;
      borderless_monocle = true;
    };
  };

  services.sxhkd = {
    enable = true;

    keybindings = {
      "super + Return" = "wez";
      "super + w" = "firefox";
      "super + r" = "${pkgs.rofi}/bin/rofi -show drun";
      "ctrl + alt + Delete" = "bspc quit";
      "alt + q" = "bspc node -c";
      "super + m" = "bspc desktop -l next";
    };
  };
}
