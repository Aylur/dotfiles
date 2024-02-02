{ inputs, pkgs, config, ... }:
let
  ags = inputs.ags.packages.${pkgs.system}.ags;
  conf = pkgs.writeText "config" ''
    exec-once = swww init
    exec-once = swww img ${../ags/assets/leaves.jpg}
    exec-once = ags -c ${./greeter/greeter.js}; hyprctl dispatch exit
    misc {
      disable_hyprland_logo = true
      disable_splash_rendering = true
      force_default_wallpaper = 0
    }
    input {
      kb_layout = ${config.services.xserver.layout}
    }
  '';
in
{
  services.xserver.displayManager.startx.enable = true;
  services.greetd = {
    enable = true;
    settings.default_session.command = "Hyprland --config ${conf}";
  };

  programs.hyprland = {
    enable = true;
    package = inputs.hyprland.packages.${pkgs.system}.hyprland;
    xwayland.enable = true;
  };

  xdg.portal = {
    enable = true;
    extraPortals = with pkgs; [
      xdg-desktop-portal-gtk
    ];
  };

  security = {
    polkit.enable = true;
    pam.services.ags = {};
  };

  environment.systemPackages = with pkgs.gnome; [
    ags
    pkgs.swww
    pkgs.loupe
    adwaita-icon-theme
    nautilus
    baobab
    gnome-calendar
    gnome-boxes
    gnome-system-monitor
    gnome-control-center
    gnome-weather
    gnome-calculator
    gnome-clocks
    gnome-software # for flatpak
  ];

  systemd = {
    user.services.polkit-gnome-authentication-agent-1 = {
      description = "polkit-gnome-authentication-agent-1";
      wantedBy = [ "graphical-session.target" ];
      wants = [ "graphical-session.target" ];
      after = [ "graphical-session.target" ];
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
    };
  };
}
