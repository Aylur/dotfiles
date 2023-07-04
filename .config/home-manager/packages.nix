{ pkgs, ... }:
{
  home.packages = with pkgs; [
    # tools
    bat exa 
    socat jq htop acpi inotify-tools ffmpeg
    wl-gammactl wlsunset wl-clipboard wf-recorder hyprpicker
    pavucontrol blueberry bluez brightnessctl playerctl imagemagick networkmanager
    # gjs gnome.gnome-bluetooth upower networkmanager gtk3 pango cairo harfbuzz gdk-pixbuf

    # fun
    fortune jp2a pywal
    glow vhs gum slides charm skate
    yabridge yabridgectl wine-staging

    wezterm 
    vscode
    distrobox
    sassc glib

    # file manager
    ranger

    # langs
    meson ninja
    nodejs cargo rustc go
    jdk

    nodePackages_latest.typescript
    nodePackages_latest.eslint
    # nodePackages_latest.prettier
    # postman
    # sqlitebrowser

    # ls
    llvmPackages_9.libclang
    nodePackages.bash-language-server
    nodePackages.vscode-langservers-extracted
    nodePackages.vls
    lua-language-server
    marksman
    rnix-lsp
    gopls
  ];
}
