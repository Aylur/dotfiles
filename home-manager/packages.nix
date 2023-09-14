{ inputs, pkgs, ... }:
{
  home.packages = with pkgs; with nodePackages_latest; [
    # colorscript
    (import ./colorscript.nix { inherit pkgs; })

    # gui
    obsidian spotify caprine-bin d-spy easyeffects
    figma-linux github-desktop gimp transmission_4-gtk

    # nixgl
    nixgl.auto.nixGLDefault
    nixgl.auto.nixGLNvidia
    nixgl.auto.nixGLNvidiaBumblebee
    nixgl.nixGLIntel

    # tools
    bat eza ranger fd ripgrep fzf
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
    nodejs go bun sassc
    typescript python311
    meson ninja eslint
  ];
}
