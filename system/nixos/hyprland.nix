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

    # xdg.portal = {
    #   enable = true;
    #   extraPortals = with pkgs; [
    #     xdg-desktop-portal-gtk
    #     xdg-desktop-portal-hyprland
    #     xdg-desktop-portal-wlr
    #     xdg-desktop-portal-gnome
    #   ];
    #   configPackages = with pkgs; [
    #     xdg-desktop-portal-gtk
    #     xdg-desktop-portal-hyprland
    #     xdg-desktop-portal-wlr
    #     xdg-desktop-portal-gnome
    #   ];
    #   config.common = {
    #     default = ["gnome" "hyprland" "gtk"];
    #     "org.freedesktop.impl.portal.Settings" = "gnome";
    #   };
    # };

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
