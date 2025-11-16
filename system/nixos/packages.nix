{
  pkgs,
  inputs,
  ...
}: {
  environment.systemPackages = [
    # cli
    pkgs.imagemagick
    pkgs.distrobox
    pkgs.tmux
    pkgs.nushell
    pkgs.starship
    pkgs.bat
    pkgs.eza
    pkgs.fd
    pkgs.ripgrep
    pkgs.fzf
    pkgs.lazydocker
    pkgs.lazygit
    pkgs.btop
    pkgs.libnotify

    # music
    # pkgs.yabridge
    # pkgs.yabridgectl
    # pkgs.wine-staging

    # themes
    pkgs.adw-gtk3
    pkgs.yaru-theme

    # icons
    pkgs.qogir-icon-theme
    pkgs.morewaita-icon-theme
    pkgs.papirus-icon-theme

    # fonts
    pkgs.nerd-fonts.caskaydia-cove
    pkgs.nerd-fonts.ubuntu

    # apps
    pkgs.ghostty
    pkgs.spotify
    pkgs.fragments
    inputs.icon-browser.packages.${pkgs.system}.default
    (pkgs.mpv.override {scripts = [pkgs.mpvScripts.mpris];})

    # wayland
    pkgs.wl-clipboard
    pkgs.wf-recorder
  ];
}
