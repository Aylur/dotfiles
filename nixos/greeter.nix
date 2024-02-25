{ pkgs, config, username, asztal, ... }: {
  services.greetd = {
    enable = true;
    settings.default_session.command = asztal.greeter {
      cursor = "Qogir";
      layout = config.services.xserver.xkb.layout;
    };
  };

  systemd.tmpfiles.rules = [
    "d '/var/cache/greeter' - greeter greeter - -"
  ];

  system.activationScripts.wallpaper = ''
    PATH=$PATH:${pkgs.coreutils}/bin:${pkgs.gawk}/bin:${pkgs.jq}/bin
    CACHE="/var/cache/greeter"
    OPTS="$CACHE/options.json"

    cp /home/${username}/.cache/ags/options.json $OPTS
    chown greeter:greeter $OPTS

    BG=$(cat $OPTS | jq -r '.wallpaper // "/home/${username}/.config/background"')

    cp $BG $CACHE/background
    chown greeter:greeter $CACHE/background
  '';

  environment.systemPackages = with pkgs; [
    qogir-icon-theme
    morewaita-icon-theme
    gnome.adwaita-icon-theme
  ];
}
