{ pkgs, ... }:
{
  home.packages = with pkgs; [
    # tools
    bat exa ranger
    socat jq htop acpi inotify-tools ffmpeg

    # hyprland
    wl-gammactl wl-clipboard wf-recorder
    hyprpicker wayshot imagemagick
    pavucontrol brightnessctl swww

    # fun
    fortune jp2a pywal
    glow vhs gum slides charm skate
    yabridge yabridgectl wine-staging

    distrobox
    wezterm 
    vscode

    # langs
    meson ninja
    nodejs go
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

    # neovim
    fzf ripgrep fd stylua cargo
    chafa ffmpegthumbnailer poppler_utils
    fontpreview xclip
  ];
}
