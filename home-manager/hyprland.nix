{
  inputs,
  pkgs,
  ...
}: {
  home.packages = with pkgs; [
    inputs.my-shell.packages.${pkgs.system}.astal
    inputs.my-shell.packages.${pkgs.system}.asztal
    inputs.my-shell.packages.${pkgs.system}.screenrecord
    (import ./scripts/screenshot.nix pkgs)
    brightnessctl
    pulseaudio # pactl
    playerctl
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
    package = inputs.hyprland.packages.${pkgs.system}.default;

    plugins = [
      # inputs.hyprland-hyprspace.packages.${pkgs.system}.default
      # inputs.hyprgrass.packages.${pkgs.system}.default
    ];

    settings = {
      exec-once = [
        "hyprctl setcursor Qogir 24"
        "asztal"
        "swww-daemon"
        "fragments"
      ];

      monitor = [
        # "eDP-1, 1920x1080, 0x0, 1"
        # "HDMI-A-1, 2560x1440, 1920x0, 1"
        ",preferred,auto,1"
      ];

      general = {
        layout = "dwindle";
        resize_on_border = true;
      };

      misc = {
        disable_splash_rendering = true;
        force_default_wallpaper = 1;
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
        # no_gaps_when_only = "yes";
      };

      gestures = {
        workspace_swipe = true;
        workspace_swipe_touch = true;
        workspace_swipe_use_r = true;
      };

      windowrule = let
        f = regex: "float, ^(${regex})$";
      in [
        (f "org.gnome.Calculator")
        (f "org.gnome.Nautilus")
        (f "pavucontrol")
        (f "nm-connection-editor")
        (f "blueberry.py")
        (f "org.gnome.Settings")
        (f "org.gnome.design.Palette")
        (f "Color Picker")
        (f "xdg-desktop-portal")
        (f "xdg-desktop-portal-gnome")
        (f "de.haeckerfelix.Fragments")
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
          "CTRL SHIFT, R, exec,     asztal quit; asztal"
          "SUPER, R, exec,          asztal toggle launcher"
          "SUPER, Tab, exec,        asztal eval \"launcher('h')\""
          ",XF86PowerOff, exec,     asztal toggle powermenu"
          ",XF86Launch4, exec,      screenrecord"
          "SHIFT,XF86Launch4, exec, screenrecord --full"
          ",Print,         exec,    screenshot"
          "SHIFT,Print,    exec,    screenshot --full"
          "SUPER, Return, exec,     xterm" # xterm is a symlink, not actually xterm
          "SUPER, W, exec,          firefox"
          "SUPER, E, exec,          wezterm -e lf"

          "ALT, Tab,            focuscurrentorlast"
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
        ",XF86AudioPlay,    exec, playerctl play-pause"
        ",XF86AudioStop,    exec, playerctl pause"
        ",XF86AudioPause,   exec, playerctl pause"
        ",XF86AudioPrev,    exec, playerctl previous"
        ",XF86AudioNext,    exec, playerctl next"
        ",XF86AudioMicMute, exec, pactl set-source-mute @DEFAULT_SOURCE@ toggle"
      ];

      bindm = [
        "SUPER, mouse:273, resizewindow"
        "SUPER, mouse:272, movewindow"
      ];

      decoration = {
        shadow = {
          range = 6;
          render_power = 2;
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

      "plugin:touch_gestures" = {
        sensitivity = 8.0;
        workspace_swipe_fingers = 3;
        long_press_delay = 400;
        edge_margin = 16;
        hyprgrass-bind = [
          ", edge:r:l, workspace, +1"
          ", edge:l:r, workspace, -1"
          ", edge:d:u, exec, my-shell toggle launcher"
        ];
      };

      # plugin = {
      #   overview = {
      #     centerAligned = true;
      #     hideTopLayers = true;
      #     hideOverlayLayers = true;
      #     showNewWorkspace = true;
      #     exitOnClick = true;
      #     exitOnSwitch = true;
      #     drawActiveWorkspace = true;
      #     reverseSwipe = true;
      #   };
      #
      #   hyprbars = {
      #     bar_color = "rgb(2a2a2a)";
      #     bar_height = 28;
      #     col_text = "rgba(ffffffdd)";
      #     bar_text_size = 11;
      #     bar_text_font = "Ubuntu Nerd Font";
      #
      #     buttons = {
      #       button_size = 0;
      #       "col.maximize" = "rgba(ffffff11)";
      #       "col.close" = "rgba(ff111133)";
      #     };
      #   };
      # };
    };
  };
}
