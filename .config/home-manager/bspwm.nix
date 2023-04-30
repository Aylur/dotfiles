{ pkgs, ... }:
{
  home.packages = with pkgs; [ 
    polkit_gnome
    rofi eww
  ];
  xsession.windowManager.bspwm = {
    enable = true;
    extraConfig = ''
      pgrep -x sxhkd > /dev/null || sxhkd &
      ~/.config/eww/scripts/init
      ${pkgs.polkit_gnome}/libexec/polkit-gnome-authentication-agent-1
    '';
    monitors = {
      HDMI-A-0 = [ "1" "2" "3" "4" "5" ];
      eDP = [ "1" "2" "3" "4" "5" ];
    };
    rules = {
      "Screenkey" = { manage = false; };
    };
    settings = {
      border_width         = 1;
      window_gap           = 16;
      split_ratio          = 0.52;
      borderless_monocle   = true;
      gapless_monocle      = true;
    };
  };
  services.sxhkd = {
    enable = true;
    keybindings = {
      "super + Return" = "nixGL wezterm";
      "super + w" = "flatpak run org.mozilla.firefox";
      "super + r" = "rofi -show drun";
      "super + Escape" = "pkill -USR1 -x sxhkd";
      "ctrl + alt + Delete" = "bspc quit";
      "super + shift + r" = "bspc wm -r && ~/.config/eww/scripts/init";
      "alt + q" = "bspc node -c";
    # alternate between the tiled and monocle layout
      "super + m" = "bspc desktop -l next"; 
    # send the newest marked node to the newest preselected node
      "super + y" = "bspc node newest.marked.local -n newest.!automatic.local"; 
    # swap the current node and the biggest window
      "super + g" = "bspc node -s biggest.window";
    # set the window state
      "super + {t,s,f}" = "bspc node -t {tiled,floating,fullscreen}";
    # set the node flags
      "super + ctrl + {m,x,y,z}" = "bspc node -g {marked,locked,sticky,private}";
    # focus the node in the given direction
      "super + {_,shift + }{h,j,k,l}" = "bspc node -{f,s} {west,south,north,east}";
    # focus the next/previous window in the current desktop
      "super + {_,shift + }Tab" = "bspc node -f {next,prev}.local.!hidden.window";
    # focus the last node/desktop
      "alt + Tab" = "bspc node -f last";
    # focus or send to the given desktop
      "super + {_,shift + }{1-9,0}" = "bspc {desktop -f,node -d} '^{1-9,10}'";
    # expand a window by moving one of its side outward
      "super + alt + {h,j,k,l}" = "bspc node -z {left -20 0,bottom 0 20,top 0 -20,right 20 0}";
    # contract a window by moving one of its side inward
      "super + alt + shift + {h,j,k,l}" = "bspc node -z {right -20 0,top 0 20,bottom 0 -20,left 20 0}";
    # move a floating window
      "super + ctrl {h,j,k,l}" = "bspc node -v {-20 0,0 20,0 -20,20 0}"; 
    };
  };
}
