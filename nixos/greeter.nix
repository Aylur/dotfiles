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
    cp /home/${username}/.config/background         /var/cache/greeter/background
    ${pkgs.coreutils}/bin/chown greeter:greeter     /var/cache/greeter/background
    cp /home/${username}/.cache/ags/options.json    /var/cache/greeter/options.json
    ${pkgs.coreutils}/bin/chown greeter:greeter     /var/cache/greeter/options.json
  '';

  environment.systemPackages = with pkgs; [
    qogir-icon-theme
    morewaita-icon-theme
    gnome.adwaita-icon-theme
  ];
}
