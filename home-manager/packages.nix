{ pkgs, ... }:
{
  xdg.desktopEntries = {
    "lf" = {
      name = "lf";
      noDisplay = true;
    };
  };

  home.packages = with pkgs; with gnome; [
    # colorscript
    (import ./colorscript.nix { inherit pkgs; })

    # gui
    obsidian
    (mpv.override { scripts = [mpvScripts.mpris]; })
    libreoffice
    spotify
    caprine-bin
    d-spy
    github-desktop
    gimp
    transmission_4-gtk
    discord
    teams-for-linux
    icon-library
    dconf-editor

    # tools
    bat
    eza
    fd
    ripgrep
    fzf
    libnotify
    killall
    zip
    unzip
    glib

    # fun
    glow
    slides
    yabridge
    yabridgectl
    wine-staging
    distrobox
  ];
}
