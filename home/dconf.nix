{lib, ...}:
with lib.hm.gvariant; {
  dconf.settings = {
    "org/gnome/desktop/input-sources" = {
      sources = [(mkTuple ["xkb" "hu"]) (mkTuple ["xkb" "us"])];
    };

    "org/gnome/desktop/interface" = {
      show-battery-percentage = true;
      font-name = "Ubuntu Nerd Font 11";
      monospace-font-name = "CaskaydiaCove Nerd Font 10";
      cursor-theme = "Qogir";
      icon-theme = "MoreWaita";
      gtk-theme = "adw-gtk3";
    };

    "org/gnome/desktop/peripherals/touchpad" = {
      tap-to-click = true;
      two-finger-scrolling-enabled = true;
    };

    "org/gnome/desktop/session" = {
      idle-delay = mkUint32 0;
    };

    "org/gnome/desktop/wm/keybindings" = {
      close = ["<Alt>q"];
      minimize = []; # <Super>H
      move-to-workspace-1 = ["<Shift><Super>1"];
      move-to-workspace-2 = ["<Shift><Super>2"];
      move-to-workspace-3 = ["<Shift><Super>3"];
      move-to-workspace-4 = ["<Shift><Super>4"];
      move-to-workspace-5 = ["<Shift><Super>5"];
      switch-to-workspace-1 = ["<Super>1"];
      switch-to-workspace-2 = ["<Super>2"];
      switch-to-workspace-3 = ["<Super>3"];
      switch-to-workspace-4 = ["<Super>4"];
      switch-to-workspace-5 = ["<Super>5"];
      switch-to-workspace-right = ["<Super>l"];
      switch-to-workspace-left = ["<Super>h"];
      toggle-fullscreen = ["<Super>g"];
      toggle-maximized = ["<Super>f"];
    };

    "org/gnome/shell/keybindings" = {
      switch-to-application-1 = [];
      switch-to-application-2 = [];
      switch-to-application-3 = [];
      switch-to-application-4 = [];
      switch-to-application-5 = [];
    };

    "org/gnome/desktop/wm/preferences" = {
      mouse-button-modifier = "<Super>";
      num-workspaces = 5;
      resize-with-right-button = true;
      focus-mode = "sloppy";
    };

    "org/gnome/mutter" = {
      edge-tiling = true;
      workspaces-only-on-primary = true;
    };

    "org/gnome/settings-daemon/plugins/media-keys" = {
      screensaver = []; # <Super>L
      custom-keybindings = ["/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom0/"];
      mic-mute = ["AudioMicMute"];
      next = ["AudioNext"];
      play = ["AudioPlay"];
      previous = ["AudioPrev"];
      stop = ["AudioStop"];
      volume-down = ["AudioLowerVolume"];
      volume-up = ["AudioRaiseVolume"];

      home = ["<Super>e"];
      www = ["<Super>w"];
    };

    "org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom0" = {
      binding = "<Super>Return";
      command = "ghostty";
      name = "term";
    };

    "org/gnome/settings-daemon/plugins/power" = {
      idle-dim = false;
      power-button-action = "interactive";
      sleep-inactive-ac-type = "nothing";
      sleep-inactive-battery-type = "nothing";
    };

    "org/gnome/shell/app-switcher" = {
      current-workspace-only = false;
    };

    "system/locale" = {
      region = "hu_HU.UTF-8";
    };

    "org/virt-manager/virt-manager/connections" = {
      autoconnect = ["qemu:///system"];
      uris = ["qemu:///system"];
    };

    "org/gnome/TextEditor" = {
      keybindings = "vim";
    };
  };
}
