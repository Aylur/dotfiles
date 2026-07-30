{
  pkgs,
  inputs,
  config,
  ...
}: let
  system = pkgs.stdenv.hostPlatform.system;
  astal = inputs.astal.packages.${system};
  marble = inputs.marble.packages.${system};
in {
  programs.niri.enable = true;
  programs.kdeconnect.enable = true;

  services.logind.settings.Login = {
    HandlePowerKey = "ignore";
    HandleLidSwitch = "suspend";
    HandleLidSwitchExternalPower = "ignore";
  };

  security = {
    polkit.enable = true;
    pam.services.astal-auth = {};
  };

  environment.systemPackages = [
    marble.default
    astal.mpris
    astal.notifd
    astal.brightness

    pkgs.morewaita-icon-theme
    pkgs.qogir-icon-theme
    pkgs.nerd-fonts.ubuntu

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

  systemd.user.services.niri = {
    wants = ["marble.service"];
  };

  services.greetd = let
    greeter = "${marble.default}/libexec/marble-greeter";
    dbus-run-session = "${pkgs.dbus}/bin/dbus-run-session";
    niri = "${pkgs.niri}/bin/niri";
    niri-greeter-conf = pkgs.writeText "niri-greeter-conf" ''
      spawn-sh-at-startup "${greeter}; niri msg action quit --skip-confirmation"
      hotkey-overlay { skip-at-startup; }
      cursor { xcursor-theme "Qogir-Dark"; }
      input {
        touchpad {
          tap
        }
        keyboard {
          xkb {
            layout "${config.services.xserver.xkb.layout}"
            options "${config.services.xserver.xkb.options}"
          }
        }
      }
    '';
  in {
    enable = true;
    settings.default_session.command = ''
      ${dbus-run-session} ${niri} --config ${niri-greeter-conf}
    '';
  };

  systemd.services.marble-greeter-wallpapers = {
    wantedBy = ["greetd.service"];
    before = ["greetd.service"];
    serviceConfig = {Type = "oneshot";};
    script = let
      wp =
        pkgs.writers.writeNu "wp"
        #nu
        ''
          let rundir = "/run/marble-greeter"
          mkdir $rundir
          chown greeter:greeter $rundir

          for home in (ls /home | where type == dir | get name) {
            let background = ($home | path join ".config" "background")

            if ($background | path exists) {
              let name = ($home | path basename)
              let target = $"($rundir)/($name)"
              cp $background $target
              chown greeter:greeter $target
            }
          }
        '';
    in "${wp}";
  };
}
