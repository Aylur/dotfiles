{ config, pkgs, ... }:
{
  nixpkgs.config.allowUnfree = true;
  nix.settings.experimental-features = [ "nix-command" "flakes" ];
  nix.package = pkgs.nix;
  
  home = {
    packages = with pkgs; [
      # gnome
      gnome.gnome-tweaks
      gnome.dconf-editor
      # wm
      awesome bspwm
      eww-wayland rofi-wayland
      # tools
      socat jq tiramisu htop
      swaynotificationcenter wl-gammactl wlsunset wl-clipboard
      pavucontrol blueberry
      flameshot
      # fun
      neofetch jp2a pywal
      # file manager
      ranger cinnamon.nemo
      # cli
      bat exa fzf ripgrep
      nushell starship
      helix vscode
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
    ];
    username = "demeter";
    homeDirectory = "/home/demeter";
    stateVersion = "21.11";
  };
  
  programs = {
    home-manager.enable = true;
  };
}
