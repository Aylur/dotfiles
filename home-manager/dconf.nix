{
  dconf.settings = {
    "org/gnome/shell" = {
      favorite-apps = [
        "firefox.desktop"
        "org.wezfurlong.wezterm.desktop"
        "org.gnome.Nautilus.desktop"
        "org.gnome.Calendar.desktop"
        "obsidian.desktop"
        "transmission-gtk.desktop"
        "caprine.desktop"
        "teams-for-linux.desktop"
        "discord.desktop"
        "spotify.desktop"
        "com.usebottles.bottles.desktop"
        "org.gnome.Software.desktop"
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
      move-to-workspace-1 = ["<Shift><Super>1"];
      move-to-workspace-2 = ["<Shift><Super>2"];
      move-to-workspace-3 = ["<Shift><Super>3"];
      move-to-workspace-4 = ["<Shift><Super>4"];
      move-to-workspace-5 = ["<Shift><Super>5"];
    };

    "org/gnome/settings-daemon/plugins/media-keys"= {
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

    "org/gnome/desktop/peripherals/touchpad" = {
      tap-to-click = true;
    };

    "org/gnome/desktop/wm/preferences" = {
      resize-with-right-button = true;
      mouse-button-modifier = "<Super>";
    };

    "org/gnome/mutter" = {
      edge-tiling = true;
      dynamic-workspaces = false;
      num-workspaces = 5;
    };

    "org/virt-manager/virt-manager/connections" = {
      autoconnect = ["qemu:///system"];
      uris = ["qemu:///system"];
    };
  };
}
