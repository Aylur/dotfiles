{ pkgs, ... }:
{
  home.packages = with pkgs; [
    # wm
    # awesome bspwm sxhkd
    # eww rofi
    eww-wayland rofi-wayland

    # tools
    socat jq htop
    wl-gammactl wlsunset wl-clipboard hyprpicker
    pavucontrol blueberry bluez brightnessctl playerctl imagemagick
    # gjs gnome.gnome-bluetooth upower networkmanager gtk3 pango cairo harfbuzz gdk-pixbuf

    # fun
    neofetch jp2a pywal
    yabridge yabridgectl wine-staging

    # file manager
    ranger cinnamon.nemo

    # cli
    wezterm vscode
    bat exa fzf ripgrep     
    distrobox
    sassc

    # langs
    nodejs cargo rustc
    agda jdk
  ];
}
