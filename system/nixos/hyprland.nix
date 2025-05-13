{
  pkgs,
  config,
  lib,
  ...
}: {
  options.hyprland = {
    enable = lib.mkEnableOption "Hyprland";
  };

  config = lib.mkIf config.hyprland.enable {
    programs.hyprland.withUWSM = true;
    programs.hyprland.enable = true;
    programs.kdeconnect.enable = true;
    services.xserver.displayManager.startx.enable = true;

    services.logind.extraConfig = ''
      HandlePowerKey=ignore
      HandleLidSwitch=suspend
      HandleLidSwitchExternalPower=ignore
    '';

    xdg.portal = {
      enable = true;
      extraPortals = with pkgs; [
        xdg-desktop-portal-gtk
      ];
    };

    security = {
      polkit.enable = true;
      pam.services.astal-auth = {};
    };

    environment.systemPackages = with pkgs; [
      morewaita-icon-theme
      adwaita-icon-theme
      qogir-icon-theme
      loupe
      nautilus
      baobab
      gnome-text-editor
      gnome-calendar
      gnome-boxes
      gnome-system-monitor
      gnome-control-center
      gnome-weather
      gnome-calculator
      gnome-clocks
      gnome-software # for flatpak
      wl-clipboard
      wl-gammactl
    ];

    systemd = {
      user.services.polkit-gnome-authentication-agent-1 = {
        description = "polkit-gnome-authentication-agent-1";
        wantedBy = ["graphical-session.target"];
        wants = ["graphical-session.target"];
        after = ["graphical-session.target"];
        serviceConfig = {
          Type = "simple";
          ExecStart = "${pkgs.polkit_gnome}/libexec/polkit-gnome-authentication-agent-1";
          Restart = "on-failure";
          RestartSec = 1;
          TimeoutStopSec = 10;
        };
      };
    };

    services = {
      gvfs.enable = true;
      devmon.enable = true;
      udisks2.enable = true;
      upower.enable = true;
      power-profiles-daemon.enable = true;
      accounts-daemon.enable = true;
      gnome = {
        evolution-data-server.enable = true;
        glib-networking.enable = true;
        gnome-keyring.enable = true;
        gnome-online-accounts.enable = true;
        localsearch.enable = true;
        tinysparql.enable = true;
      };
    };

    systemd.tmpfiles.rules = [
      "d '/var/cache/greeter' - greeter greeter - -"
    ];
  };
}
