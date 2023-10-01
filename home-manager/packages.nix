{ pkgs, ... }:
{
  # hide entries
  xdg.desktopEntries = {
    "ranger" = {
      name = "ranger";
      noDisplay = true;
    };
  };

  home.packages = with pkgs; with nodePackages_latest; with gnome; [
    # colorscript
    (import ./colorscript.nix { inherit pkgs; })

    # gui
    obsidian
    (mpv.override { scripts = [mpvScripts.mpris]; })
    libreoffice
    spotify
    caprine-bin
    d-spy
    easyeffects
    figma-linux
    github-desktop
    gimp
    transmission_4-gtk
    discord
    bottles
    teams-for-linux
    icon-library
    dconf-editor

    # tools
    bat
    eza
    ranger
    fd
    ripgrep
    fzf
    socat
    jq
    acpi
    inotify-tools
    ffmpeg
    libnotify
    killall

    # hyprland
    wl-gammactl
    wl-clipboard
    wf-recorder
    hyprpicker
    wayshot
    swappy
    slurp
    imagemagick
    pavucontrol
    brightnessctl
    swww

    # fun
    fortune
    jp2a
    pywal
    glow
    vhs
    gum
    slides
    charm
    skate
    yabridge
    yabridgectl
    wine-staging
    distrobox

    # langs
    nodejs
    go
    bun
    sassc
    typescript
    meson
    ninja
    eslint
  ];
}
