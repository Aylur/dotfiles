{
  inputs,
  pkgs,
  ...
}: {
  home.packages = with pkgs; [
    inputs.marble.packages.${pkgs.system}.astal
    inputs.marble.packages.${pkgs.system}.default
    inputs.battery-notifier.packages.${pkgs.system}.default
    # inputs.marble.packages.${pkgs.system}.screenrecord
    astal.mpris
    ((import ../scripts pkgs).screenshot)
    brightnessctl
    pulseaudio # pactl
    swww
    wf-recorder
    slurp
  ];

  xdg.desktopEntries."org.gnome.Settings" = {
    name = "Settings";
    comment = "Gnome Control Center";
    icon = "org.gnome.Settings";
    exec = "env XDG_CURRENT_DESKTOP=gnome ${pkgs.gnome-control-center}/bin/gnome-control-center";
    categories = ["X-Preferences"];
    terminal = false;
  };

  wayland.windowManager.hyprland = {
    enable = true;
    systemd.enable = false;

    settings = {
      exec-once = [
        "hyprctl setcursor Qogir 24"
        "uwsm app -- marble"
        "uwsm app -- marble-launcher"
        "swww-daemon"
        "fragments"
        # TODO: systemd unit
        "battery-notifier"
      ];

      monitor = [",preferred,auto,1"];

      general = {
        layout = "dwindle";
        resize_on_border = true;
      };

      misc = {
        disable_splash_rendering = true;
        force_default_wallpaper = 1;
        focus_on_activate = true;
      };

      input = {
        kb_layout = "hu,us";
        follow_mouse = 1;
        touchpad = {
          natural_scroll = "yes";
          disable_while_typing = true;
          drag_lock = true;
        };
        sensitivity = 0;
        float_switch_override_focus = 2;
      };

      binds = {
        allow_workspace_cycles = true;
      };

      dwindle = {
        pseudotile = "yes";
        preserve_split = "yes";
      };

      gestures = {
        workspace_swipe = true;
        workspace_swipe_touch = true;
        workspace_swipe_use_r = true;
      };

      windowrulev2 = [
        "float, class:(.*)"
        "workspace 7, title:Spotify"
      ];

      bind = let
        binding = mod: cmd: key: arg: "${mod}, ${key}, ${cmd}, ${arg}";
        mvfocus = binding "SUPER" "movefocus";
        ws = binding "SUPER" "workspace";
        resizeactive = binding "SUPER CTRL" "resizeactive";
        mvactive = binding "SUPER ALT" "moveactive";
        mvtows = binding "SUPER SHIFT" "movetoworkspace";
        arr = [1 2 3 4 5 6 7];
      in
        [
          "CTRL SHIFT, R, exec,         astal -i marble -q; marble"
          "SUPER, R, exec,              marble-launcher --open"
          "SUPER, Tab, exec,            marble-launcher ':h'"
          ",XF86PowerOff, exec,         marble shutdown"
          # ",XF86Launch4, exec,          screenrecord"
          # "SHIFT, XF86Launch4, exec,    screenrecord --full"
          ",Print, exec,                screenshot"
          "SHIFT, Print, exec,          screenshot --full"
          "SUPER, Return, exec,         xterm" # xterm is a symlink, not actually xterm
          "SUPER, W, exec,              firefox"
          "SUPER, E, exec,              xterm -e lf"

          "ALT, Tab, exec,      hyprctl dispatch focuscurrentorlast; hyprctl dispatch alterzorder top"
          "CTRL ALT, Delete,    exit"
          "ALT, Q,              killactive"
          "SUPER, F,            togglefloating"
          "SUPER, G,            fullscreen"
          "SUPER, P,            togglesplit"

          (mvfocus "k" "u")
          (mvfocus "j" "d")
          (mvfocus "l" "r")
          (mvfocus "h" "l")
          (ws "left" "e-1")
          (ws "right" "e+1")
          (mvtows "left" "e-1")
          (mvtows "right" "e+1")
          (resizeactive "k" "0 -20")
          (resizeactive "j" "0 20")
          (resizeactive "l" "20 0")
          (resizeactive "h" "-20 0")
          (mvactive "k" "0 -20")
          (mvactive "j" "0 20")
          (mvactive "l" "20 0")
          (mvactive "h" "-20 0")
        ]
        ++ (map (i: ws (toString i) (toString i)) arr)
        ++ (map (i: mvtows (toString i) (toString i)) arr);

      bindle = [
        ",XF86MonBrightnessUp,   exec, brightnessctl set +5%"
        ",XF86MonBrightnessDown, exec, brightnessctl set  5%-"
        ",XF86KbdBrightnessUp,   exec, brightnessctl -d asus::kbd_backlight set +1"
        ",XF86KbdBrightnessDown, exec, brightnessctl -d asus::kbd_backlight set  1-"
        ",XF86AudioRaiseVolume,  exec, pactl set-sink-volume @DEFAULT_SINK@ +5%"
        ",XF86AudioLowerVolume,  exec, pactl set-sink-volume @DEFAULT_SINK@ -5%"
      ];

      bindl = [
        ",XF86AudioPlay,    exec, astal-mpris play-pause"
        ",XF86AudioStop,    exec, astal-mpris pause"
        ",XF86AudioPause,   exec, astal-mpris pause"
        ",XF86AudioPrev,    exec, astal-mpris previous"
        ",XF86AudioNext,    exec, astal-mpris next"
        ",XF86AudioMicMute, exec, pactl set-source-mute @DEFAULT_SOURCE@ toggle"
      ];

      bindm = [
        "SUPER, mouse:273, resizewindow"
        "SUPER, mouse:272, movewindow"
      ];

      decoration = {
        shadow = {
          range = 11;
          render_power = 0;
          color = "rgba(0,0,0,0.3)";
        };

        dim_inactive = false;

        blur = {
          enabled = true;
          size = 8;
          passes = 3;
          new_optimizations = "on";
          noise = 0.01;
          contrast = 0.9;
          brightness = 0.8;
          popups = true;
        };
      };

      animations = {
        enabled = "yes";
        bezier = "myBezier, 0.05, 0.9, 0.1, 1.05";
        animation = [
          "windows, 1, 5, myBezier"
          "windowsOut, 1, 7, default, popin 80%"
          "border, 1, 10, default"
          "fade, 1, 7, default"
          "workspaces, 1, 6, default"
        ];
      };
    };
  };
}
