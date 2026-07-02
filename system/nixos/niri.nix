{
  pkgs,
  inputs,
  ...
}: let
  system = pkgs.stdenv.hostPlatform.system;
  astal = inputs.astal.packages.${system};
in {
  programs.niri.enable = true;
  programs.kdeconnect.enable = true;

  services.logind.settings.Login = {
    HandlePowerKey = "ignore";
    HandleLidSwitch = "suspend";
    HandleLidSwitchExternalPower = "ignore";
  };

  services.greetd = {
    enable = true;
    settings = {
      default_session = {
        command = "${astal.greet}/bin/astal-greet -i";
      };
    };
  };

  security = {
    polkit.enable = true;
    pam.services.astal-auth = {};
  };

  environment.systemPackages = let
    marble-default = inputs.marble-shell.packages.${system}.default;
    marble-shell = marble-default.overrideAttrs (prev: {
      pnpmDeps = prev.pnpmDeps.overrideAttrs {
        sshKey = "${inputs.vault}/ssh/id_rsa";
      };
    });
  in [
    marble-shell
    astal.mpris
    astal.notifd
    astal.greet

    pkgs.glib # gdbus
    pkgs.brightnessctl
    pkgs.pulseaudio # pactl
    pkgs.slurp
    pkgs.wayshot
    pkgs.wl-clipboard
    pkgs.wf-recorder
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
    pkgs.nerd-fonts.ubuntu
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
