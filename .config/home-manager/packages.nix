{ pkgs, ... }:
{
  home.packages = with pkgs; [
    # wm
    # awesome bspwm sxhkd
    # eww rofi
    eww-wayland rofi-wayland
    # tools
    socat jq tiramisu htop
    networkmanager wl-gammactl wlsunset wl-clipboard hyprpicker
    pavucontrol blueberry bluez brightnessctl playerctl imagemagick
    # fun
    neofetch jp2a pywal
    yabridge yabridgectl wine-staging
    # file manager
    ranger cinnamon.nemo
    # cli
    bat exa fzf ripgrep     
    helix vscode
    distrobox
    nushell
    meson ninja sassc
    glib
    # langs
    nodejs cargo rustc
    agda jdk
    # fonts
    (nerdfonts.override { fonts = [
      "Ubuntu"
      "UbuntuMono"
      "CascadiaCode"
      "Mononoki"
      "Hack"
    ]; })
    rubik
    # themes
    qogir-theme #gtk
    qogir-icon-theme
    adw-gtk3
    # helix lsp
    llvmPackages_9.libclang
    nodePackages.bash-language-server
    nodePackages.vscode-langservers-extracted
    nodePackages.typescript
    nodePackages.typescript-language-server
    nodePackages.svelte-language-server
    nodePackages.vls
    jdt-language-server
    lua-language-server
    marksman
    rnix-lsp
    rust-analyzer
    gopls
  ];
}
