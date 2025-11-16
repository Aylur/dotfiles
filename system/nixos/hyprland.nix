{
  pkgs,
  inputs,
  ...
}: {
  programs.hyprland.enable = true;
  programs.kdeconnect.enable = true;

  services.logind.extraConfig = ''
    HandlePowerKey=ignore
    HandleLidSwitch=suspend
    HandleLidSwitchExternalPower=ignore
  '';

  security = {
    polkit.enable = true;
    pam.services.astal-auth = {};
  };

  environment.systemPackages = let
    marble-shell = inputs.marble-shell.packages.${pkgs.system}.default.overrideAttrs (prev: {
      pnpmDeps = prev.pnpmDeps.overrideAttrs {
        sshKey = "${inputs.vault}/ssh/id_rsa";
      };
    });
  in [
    marble-shell
    inputs.battery-notifier.packages.${pkgs.system}.default
    pkgs.astal.mpris
    pkgs.brightnessctl
    pkgs.pulseaudio # pactl
    pkgs.slurp
    pkgs.wayshot
    pkgs.swappy
    pkgs.loupe
    pkgs.nautilus
    pkgs.baobab
    pkgs.gnome-text-editor
    pkgs.gnome-calendar
    pkgs.gnome-boxes
    pkgs.gnome-system-monitor
    pkgs.gnome-control-center
    pkgs.gnome-weather
    pkgs.gnome-calculator
    pkgs.gnome-clocks
    pkgs.gnome-software # for flatpak
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
}
