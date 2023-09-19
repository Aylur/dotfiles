{ inputs, pkgs, ... }:
let
  hyprland = inputs.hyprland.packages.${pkgs.system}.hyprland;

  launcher = pkgs.writeShellScriptBin "hypr" ''
    #!/${pkgs.bash}/bin/bash
    export WLR_NO_HARDWARE_CURSORS=1
    export _JAVA_AWT_WM_NONREPARENTING=1
    . "$HOME/.nix-profile/etc/profile.d/hm-session-vars.sh"

    if ! [[ "$PATH" =~ "$HOME/.local/bin:$HOME/bin:" ]]; then
        PATH="$HOME/.local/bin:$HOME/bin:$PATH"; fi

    if ! [[ "$PATH" =~ "$HOME/.nix-profile/bin:" ]]; then
        PATH="$HOME/.nix-profile/bin:$PATH"; fi

    export PATH

    if [[ $1 == 'fedora' ]]; then
        exec /usr/bin/Hyprland
    fi

    if command -v "nixGLIntel" &> /dev/null; then
        nixGLIntel ${hyprland}/bin/Hyprland
    else
        exec ${hyprland}/bin/Hyprland
    fi
  '';
in
{
  xdg.desktopEntries."org.gnome.Settings" = {
    name = "Settings";
    comment = "Gnome Control Center";
    icon = "org.gnome.Settings";
    exec = "env XDG_CURRENT_DESKTOP=gnome ${pkgs.gnome.gnome-control-center}/bin/gnome-control-center";
    categories = [ "X-Preferences" ];
    terminal = false;
  };

  home.packages = [ launcher ];
  home.file.".config/hypr/config".source = ../hypr;

  wayland.windowManager.hyprland = {
    enable = true;
    package = hyprland;
    systemdIntegration = true;
    enableNvidiaPatches = true;
    xwayland.enable = true;
    extraConfig = ''
      source=~/.config/hypr/config/monitors.conf
      source=~/.config/hypr/config/settings.conf
      source=~/.config/hypr/config/rules.conf
      source=~/.config/hypr/config/binds.conf
      source=~/.config/hypr/config/theme.conf

      # exec-once = /usr/libexec/polkit-gnome-authentication-agent-1
      exec-once = ags -b hypr
      exec-once = flatpak run com.transmissionbt.Transmission
      exec-once = hyprctl setcursor Qogir 24
    '';
  };
}
