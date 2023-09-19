{
  dconf.settings = {
    "org/gnome/shell" = {
      favorite-apps = [
        "firefox.desktop"
        "org.wezfurlong.wezterm.desktop"
        "org.gnome.Nautilus.desktop"
        "org.gnome.Calendar.desktop"
      ];
    };

    "system/locale" = {
      region = "hu_HU.UTF-8";
    };

    "org/gnome/desktop/wm/keybindings" = {
      close = ["<Alt>q"];
      toggle-fullscreen =  ["<Super>g"];
      switch-to-workspace-1 = ["<Super>1"];
      switch-to-workspace-2 = ["<Super>2"];
      switch-to-workspace-3 = ["<Super>3"];
      switch-to-workspace-4 = ["<Super>4"];
      switch-to-workspace-5 = ["<Super>5"];
    };

    "org/gnome/settings-daemon/plugins/media-keys"= {
      media = ["Launch4"];
      mic-mute = ["AudioMicMute"];
      next = ["AudioNext"];
      pause = ["AudioStop"];
      play = ["AudioPlay"];
      previous = ["AudioPrev"];
      volume-down = ["AudioLowerVolume"];
      volume-up = ["AudioRaiseVolume"];

      home = ["<Super>e"];
      www = ["<Super>w"];
    };

    "org/gnome/desktop/wm/preferences" = {
      resize-with-right-button = true;
      mouse-button-modifier = "<Super>";
    };

    "org/gnome/mutter" = {
      edge-tiling = true;
    };
  };
}
