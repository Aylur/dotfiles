{pkgs, ...}: {
  imports = [
    ./scripts/blocks.nix
    ./scripts/nx-switch.nix
    ./scripts/vault.nix
  ];

  home.packages = with pkgs;
  with gnome; [
    # gui
    # obsidian
    (mpv.override {scripts = [mpvScripts.mpris];})
    # libreoffice
    spotify
    # caprine-bin
    # d-spy
    # github-desktop
    # gimp
    transmission_4-gtk
    # discord
    # teams-for-linux
    # icon-library
    # dconf-editor
    gnome-secrets

    # langs
    poetry
    nodejs

    # tools
    # steam-run
    bat
    eza
    fd
    ripgrep
    fzf
    # libnotify
    # killall
    # zip
    # unzip
    # glib
    lazydocker

    # fun
    # glow
    # slides
    # yabridge
    # yabridgectl
    # wine-staging
  ];
}
