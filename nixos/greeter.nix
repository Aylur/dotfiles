{ inputs, pkgs, config, username, greeter, ... }:
let
  ags = inputs.ags.packages.${pkgs.system}.default.override {
    extraPackages = [pkgs.accountsservice];
  };

  cage = pkgs.writeShellScript "greeter" ''
    export XKB_DEFAULT_LAYOUT=${config.services.xserver.xkb.layout}
    export XCURSOR_THEME=Qogir
    export PATH=$PATH:${pkgs.dart-sass}/bin
    export PATH=$PATH:${pkgs.fd}/bin
    ${pkgs.cage}/bin/cage -ds -m last ${ags}/bin/ags -- -c ${greeter.config}/greeter.js
  '';
in
{
  services.greetd = {
    enable = true;
    settings.default_session.command = cage;
  };

  systemd.tmpfiles.rules = [
    "d '/var/cache/greeter' - greeter greeter - -"
  ];

  system.activationScripts.wallpaper = ''
    CACHE="/var/cache/greeter"
    OPTS="$CACHE/options.json"

    cp /home/${username}/.cache/ags/options.json $OPTS
    ${pkgs.coreutils}/bin/chown greeter:greeter $OPTS

    BG=$(cat $OPTS | ${pkgs.jq}/bin/jq -r '.wallpaper // "/home/${username}/.config/background"')

    cp $BG $CACHE/background
    ${pkgs.coreutils}/bin/chown greeter:greeter $CACHE/background
  '';

  environment.systemPackages = with pkgs; [
    qogir-icon-theme
    morewaita-icon-theme
    gnome.adwaita-icon-theme
  ];
}
