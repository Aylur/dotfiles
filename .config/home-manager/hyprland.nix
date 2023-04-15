{ config, pkgs, lib, ... }:
let
  flake-compat = builtins.fetchTarball "https://github.com/edolstra/flake-compat/archive/master.tar.gz";

  hyprland = (import flake-compat {
    src = builtins.fetchTarball "https://github.com/hyprwm/Hyprland/archive/master.tar.gz";
  }).defaultNix;
in
{
 
  imports = [
    hyprland.homeManagerModules.default
  ];

  wayland.windowManager.hyprland = {
    enable = true;
    nvidiaPatches = true;
    extraConfig = ''
    # Monitors
      monitor=eDP-1,1920x1080,0x0,1
      monitor=HDMI-A-1,2560x1440,1920x0,1
      workspace=eDP-1,1
      workspace=HDMI-A-1,3
      monitor=eDP-1,addreserved,0,0,-10,0

    # Startup
      exec-once = /usr/libexec/polkit-gnome-authentication-agent-1
      exec-once = bash ~/.config/eww/scripts/init
      exec-once = bash ~/.profile
      exec-once = flatpak run com.transmissionbt.Transmission
      exec-once = hyprctl setcursor Qogir 24
      blurls "eww_powermenu"

    # Settings
      general {
        gaps_in = 8
          gaps_out = 16
          border_size = 1
          col.active_border = rgba(3584fa66)
          col.inactive_border = rgb(2a2a2a)
          layout = dwindle
      }

      decoration {
        rounding = 11
        blur = yes
        blur_size = 2
        blur_passes = 2
        blur_new_optimizations = on

        drop_shadow = yes
        shadow_range = 8
        shadow_render_power = 2
        col.shadow = rgba(00000044)

        dim_inactive = false
      }

      input {
        kb_layout = hu
        kb_model = pc104
        follow_mouse = 1
        touchpad {
          natural_scroll = yes
        }
        sensitivity = 0
      }

      animations {
        enabled = yes
        bezier = myBezier, 0.05, 0.9, 0.1, 1.05
        animation = windows, 1, 5, myBezier
        animation = windowsOut, 1, 7, default, popin 80%
        animation = border, 1, 10, default
        animation = fade, 1, 7, default
        animation = workspaces, 1, 6, default
      }

      binds {
        allow_workspace_cycles = true
      }

      dwindle {
        pseudotile = yes
        preserve_split = yes
      # no_gaps_when_only = yes
      }

      master {
        new_is_master = false
      # no_gaps_when_only = yes
      }

      gestures {
        workspace_swipe = on
      }

    # RULES
      windowrule = float, ^(Rofi)$
      windowrule = float, ^(org.gnome.Calculator)$
      windowrule = float, ^(org.gnome.Nautilus)$
      windowrule = float, ^(eww)$
      windowrule = float, ^(pavucontrol)$
      windowrule = float, ^(nm-connection-editor)$
      windowrule = float, ^(blueberry.py)$
      windowrule = float, ^(org.gnome.Settings)$
      windowrule = float, ^(org.gnome.design.Palette)$
      windowrule = float, ^(Color Picker)$
      windowrule = float, ^(Network)$
      windowrule = float, ^(xdg-desktop-portal)$
      windowrule = float, ^(xdg-desktop-portal-gnome)$
      windowrule = float, ^(transmission-gtk)$

    # EWW
      bind = CTRL, R, exec, bash ~/.config/eww/scripts/init

    # Print
      bind = , Print,exec, distrobox-enter -n Arch -- hyprshot -m region

    # Lid
      bindl= , switch:on:Lid Switch, exec, bash ~/.config/eww/scripts/launcher screenlock

    # Launchers
      bind = SUPER, Return, exec, nixGL wezterm
      bind = SUPER, W, exec, flatpak run org.mozilla.firefox
      bind = SUPER, E, exec, nautilus
      bind = SUPER, R, exec, rofi -show drun

    # Bindings
      bind = CTRL ALT, Delete, exit
      bind = ALT, Q, killactive
      bind = SUPER, F, togglefloating
      bind = SUPER, H, fakefullscreen
      bind = SUPER, G, fullscreen
      bind = SUPER, J, togglesplit

    # Move focus with mainMod + arrow keys
      bind = SUPER, k, movefocus, u
      bind = SUPER, j, movefocus, d
      bind = SUPER, l, movefocus, r
      bind = SUPER, h, movefocus, l

    # Switch workspaces with mainMod + [0-9]
      bind = SUPER, left,   workspace, e+1
      bind = SUPER, right, workspace, e-1
      bind = SUPER, 1, workspace, 1
      bind = SUPER, 2, workspace, 2
      bind = SUPER, 3, workspace, 3
      bind = SUPER, 4, workspace, 4
      bind = SUPER, 5, workspace, 5
      bind = SUPER, 6, workspace, 6
      bind = SUPER, 7, workspace, 7
      bind = SUPER, 8, workspace, 8
      bind = SUPER, 9, workspace, 9

    # Window
      binde = SUPER CTRL, k, resizeactive, 0 -20
      binde = SUPER CTRL, j, resizeactive, 0 20
      binde = SUPER CTRL, l, resizeactive, 20 0
      binde = SUPER CTRL, h, resizeactive, -20 0
      binde = SUPER ALT,  k, moveactive, 0 -20
      binde = SUPER ALT,  j, moveactive, 0 20
      binde = SUPER ALT,  l, moveactive, 20 0
      binde = SUPER ALT,  h, moveactive, -20 0

    # Move active window to workspace
      bind = SUPER SHIFT, right, movetoworkspace, e+1
      bind = SUPER SHIFT, left,  movetoworkspace, e-1
      bind = SUPER SHIFT, 1, movetoworkspace, 1
      bind = SUPER SHIFT, 2, movetoworkspace, 2
      bind = SUPER SHIFT, 3, movetoworkspace, 3
      bind = SUPER SHIFT, 4, movetoworkspace, 4
      bind = SUPER SHIFT, 5, movetoworkspace, 5
      bind = SUPER SHIFT, 6, movetoworkspace, 6
      bind = SUPER SHIFT, 7, movetoworkspace, 7
      bind = SUPER SHIFT, 8, movetoworkspace, 8
      bind = SUPER SHIFT, 9, movetoworkspace, 9

    # Move/resize windows with mainMod + LMB/RMB and dragging
      bindm = SUPER, mouse:272, movewindow
      bindm = SUPER, mouse:273, resizewindow

    # Laptop
      bindle = , XF86MonBrightnessUp,     exec, bash ~/.config/eww/scripts/brightness screen up
      bindle = , XF86MonBrightnessDown,   exec, bash ~/.config/eww/scripts/brightness screen down
      bindle = , XF86KbdBrightnessUp,     exec, bash ~/.config/eww/scripts/brightness kbd up
      bindle = , XF86KbdBrightnessDown,   exec, bash ~/.config/eww/scripts/brightness kbd down
      bindle = , XF86AudioRaiseVolume,    exec, bash ~/.config/eww/scripts/volume up
      bindle = , XF86AudioLowerVolume,    exec, bash ~/.config/eww/scripts/volume down
      bindl  = , XF86AudioStop,           exec, playerctl stop
      bindl  = , XF86AudioPause,          exec, playerctl pause
      bindl  = , XF86AudioPrev,           exec, playerctl previous
      bindl  = , XF86AudioNext,           exec, playerctl next
      bindl  = , XF86AudioPlay,           exec, playerctl play-pause
    '';
  };
}
