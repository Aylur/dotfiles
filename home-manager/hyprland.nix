{ inputs, pkgs, ... }:
let
  hyprland = inputs.hyprland.packages.${pkgs.system}.hyprland;
  plugins = inputs.hyprland-plugins.packages.${pkgs.system};

  launcher = pkgs.writeShellScriptBin "hypr" ''
    #!/${pkgs.bash}/bin/bash

    export WLR_NO_HARDWARE_CURSORS=1
    export _JAVA_AWT_WM_NONREPARENTING=1

    exec ${hyprland}/bin/Hyprland
  '';
in
{
  home.packages = [ launcher ];

  xdg.desktopEntries."org.gnome.Settings" = {
    name = "Settings";
    comment = "Gnome Control Center";
    icon = "org.gnome.Settings";
    exec = "env XDG_CURRENT_DESKTOP=gnome ${pkgs.gnome.gnome-control-center}/bin/gnome-control-center";
    categories = [ "X-Preferences" ];
    terminal = false;
  };

  wayland.windowManager.hyprland = {
    enable = true;
    package = hyprland;
    systemd.enable = true;
    xwayland.enable = true;
    # plugins = with plugins; [ hyprbars borderspp ];

    settings = {
      exec-once = [
        "ags -b hypr"
        "hyprctl setcursor Qogir 24"
        "transmission-gtk"
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
        layers_hog_keyboard_focus = false;
        disable_splash_rendering = true;
        force_default_wallpaper = 0;
      };

      input = {
        kb_layout = "hu";
        kb_model = "pc104";
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
        workspace_swipe_forever = true;
        workspace_swipe_numbered = true;
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
		(f "transmission-gtk")
		(f "com.github.Aylur.ags")
		"workspace 7, title:Spotify"
      ];

      bind = let
        binding = mod: cmd: key: arg: "${mod}, ${key}, ${cmd}, ${arg}";
        mvfocus = binding "SUPER" "movefocus";
        ws = binding "SUPER" "workspace";
        resizeactive = binding "SUPER CTRL" "resizeactive";
        mvactive = binding "SUPER ALT" "moveactive";
        mvtows = binding "SUPER SHIFT" "movetoworkspace";
        e = "exec, ags -b hypr";
        arr = [1 2 3 4 5 6 7 8 9];
        yt = pkgs.writeShellScriptBin "yt" ''
            notify-send "Opening video" "$(wl-paste)"
            mpv "$(wl-paste)"
        '';
      in [
        "CTRL SHIFT, R,  ${e} quit; ags -b hypr"
        "SUPER, R,       ${e} -t applauncher"
        ", XF86PowerOff, ${e} -t powermenu"
        "SUPER, Tab,     ${e} -t overview"
        ", XF86Launch4,  ${e} -r 'recorder.start()'"
        ",Print,         ${e} -r 'recorder.screenshot()'"
        "SHIFT,Print,    ${e} -r 'recorder.screenshot(true)'"
        "SUPER, Return, exec, xterm" # xterm is a symlink, not actually xterm
        "SUPER, W, exec, firefox"
        "SUPER, E, exec, wezterm -e lf"

        # youtube
        ", XF86Launch1,  exec, ${yt}/bin/yt"

        "ALT, Tab, focuscurrentorlast"
        "CTRL ALT, Delete, exit"
        "ALT, Q, killactive"
        "SUPER, F, togglefloating"
        "SUPER, G, fullscreen"
        "SUPER, O, fakefullscreen"
        "SUPER, P, togglesplit"

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

      bindle = let e = "exec, ags -b hypr -r"; in [
        ",XF86MonBrightnessUp,   ${e} 'brightness.screen += 0.05; indicator.display()'"
        ",XF86MonBrightnessDown, ${e} 'brightness.screen -= 0.05; indicator.display()'"
        ",XF86KbdBrightnessUp,   ${e} 'brightness.kbd++; indicator.kbd()'"
        ",XF86KbdBrightnessDown, ${e} 'brightness.kbd--; indicator.kbd()'"
        ",XF86AudioRaiseVolume,  ${e} 'audio.speaker.volume += 0.05; indicator.speaker()'"
        ",XF86AudioLowerVolume,  ${e} 'audio.speaker.volume -= 0.05; indicator.speaker()'"
      ];

      bindl = let e = "exec, ags -b hypr -r"; in [
        ",XF86AudioPlay,    ${e} 'mpris?.playPause()'"
        ",XF86AudioStop,    ${e} 'mpris?.stop()'"
        ",XF86AudioPause,   ${e} 'mpris?.pause()'"
        ",XF86AudioPrev,    ${e} 'mpris?.previous()'"
        ",XF86AudioNext,    ${e} 'mpris?.next()'"
        ",XF86AudioMicMute, ${e} 'audio.microphone.isMuted = !audio.microphone.isMuted'"
      ];

      bindm = [
        "SUPER, mouse:273, resizewindow"
        "SUPER, mouse:272, movewindow"
      ];

      decoration = {
        drop_shadow = "yes";
        shadow_range = 8;
        shadow_render_power = 2;
        "col.shadow" = "rgba(00000044)";

        dim_inactive = false;

        blur = {
          enabled = true;
          size = 8;
          passes = 3;
          new_optimizations = "on";
          noise = 0.01;
          contrast = 0.9;
          brightness = 0.8;
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

      plugin = {
        hyprbars = {
          bar_color = "rgb(2a2a2a)";
          bar_height = 28;
          col_text = "rgba(ffffffdd)";
          bar_text_size = 11;
          bar_text_font = "Ubuntu Nerd Font";

          buttons = {
            button_size = 0;
            "col.maximize" = "rgba(ffffff11)";
            "col.close" = "rgba(ff111133)";
          };
        };
      };
    };
  };
}
