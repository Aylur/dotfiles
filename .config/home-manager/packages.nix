{ pkgs, ... }:
{
  home.packages = with pkgs; [
    # tools
    bat exa ranger
    socat jq htop acpi inotify-tools ffmpeg

    # wayland
    wl-gammactl wlsunset wl-clipboard wl-screenrec hyprpicker watershot imagemagick
    pavucontrol blueberry brightnessctl swww

    # fun
    fortune jp2a pywal
    glow vhs gum slides charm skate
    yabridge yabridgectl wine-staging

    distrobox
    wezterm 
    vscode

    # langs
    meson ninja
    nodejs cargo go
    nodePackages_latest.typescript
    nodePackages_latest.eslint
    sassc

    # ls
    llvmPackages_9.libclang
    nodePackages.bash-language-server
    nodePackages.vscode-langservers-extracted
    nodePackages.vls
    lua-language-server
    marksman
    gopls
  ];
}
