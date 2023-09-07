{ pkgs, ... }:
{
  home.packages = with pkgs; [
    # colorscript
    (import ./colorscript.nix { inherit pkgs; })

    # nixgl
    nixgl.auto.nixGLDefault
    nixgl.auto.nixGLNvidia
    nixgl.auto.nixGLNvidiaBumblebee
    nixgl.nixGLIntel

    # tools
    bat exa ranger
    socat jq htop acpi inotify-tools ffmpeg

    # hyprland
    wl-gammactl wl-clipboard wf-recorder
    hyprpicker wayshot swappy imagemagick
    pavucontrol brightnessctl swww

    # fun
    fortune jp2a pywal
    glow vhs gum slides charm skate
    yabridge yabridgectl wine-staging
    distrobox

    # langs
    meson ninja
    nodejs go bun
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
