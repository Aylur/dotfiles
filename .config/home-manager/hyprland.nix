{ pkgs, ... }:
{
  home.packages = with pkgs; [
    eww-wayland polkit_gnome
    xdg-desktop-portal-hyprland
    (hyprland.override {
      enableXWayland = true;
      hidpiXWayland = true;
      nvidiaPatches = true;
    })
  ];

  home.file = {
    ".config/hypr/hyprland.conf" = {
      text = ''
        source=~/.config/hypr/monitors.conf
        source=~/.config/hypr/settings.conf
        source=~/.config/hypr/rules.conf
        source=~/.config/hypr/binds.conf
        source=~/.config/hypr/theme.conf
        source=~/.config/hypr/startup.conf
        ${pkgs.polkit_gnome}/libexec/polkit-gnome-authentication-agent-1
        '';
    };
    ".local/bin/hypr" = {
      executable = true;
      text = ''
      #!/bin/sh
        export WLR_NO_HARDWARE_CURSORS=1
        export _JAVA_AWT_WM_NONREPARENTING=1
        . "$HOME/.nix-profile/etc/profile.d/hm-session-vars.sh"

        if ! [[ "$PATH" =~ "$HOME/.local/bin:$HOME/bin:" ]]; then
          PATH="$HOME/.local/bin:$HOME/bin:$PATH"; fi

        if ! [[ "$PATH" =~ "$HOME/.nix-profile/bin:" ]]; then
          PATH="$HOME/.nix-profile/bin:$PATH"; fi

        export PATH
        exec nixGL ${pkgs.hyprland}/bin/Hyprland
      '';
    };
  };
}
