{ pkgs, ... }:
{
  home.packages = with pkgs; [
    # tools
    socat jq htop acpi
    wl-gammactl wlsunset wl-clipboard hyprpicker
    pavucontrol blueberry bluez brightnessctl playerctl imagemagick networkmanager
    # gjs gnome.gnome-bluetooth upower networkmanager gtk3 pango cairo harfbuzz gdk-pixbuf

    # fun
    fortune jp2a pywal glow vhs gum slides
    yabridge yabridgectl wine-staging

    # file manager
    ranger cinnamon.nemo

    # cli
    wezterm vscode
    bat exa fzf ripgrep     
    distrobox
    sassc glib

    # langs
    nodejs cargo rustc
    agda jdk
  ];
}
