{ pkgs, ... }:
let
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

      if  [[ $1 == 'nix' ]]; then
          exec nixGLIntel ${pkgs.hyprland}/bin/Hyprland; fi

      exec /usr/bin/Hyprland
  '';
in
{
  home.packages = [ launcher ];
  wayland.windowManager.hyprland = {
    enable = true;
    enableNvidiaPatches = true;
    extraConfig = ''
      source=~/.config/hypr/monitors.conf
      source=~/.config/hypr/settings.conf
      source=~/.config/hypr/rules.conf
      source=~/.config/hypr/binds.conf
      source=~/.config/hypr/theme.conf
      source=~/.config/hypr/startup.conf
    '';
  };
}
