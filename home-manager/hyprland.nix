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

      if  [[ $1 == 'nix' ]]; then
          exec nixGLIntel ${hyprland}/bin/Hyprland; fi

      exec /usr/bin/Hyprland
  '';
in
{
  home.packages = [ launcher ];
  xdg.configFile.hypr.source = ../hypr;
  wayland.windowManager.hyprland = {
    enable = true;
    package = hyprland;
    systemdIntegration = false;
    enableNvidiaPatches = true;
    xwayland.enable = true;
  };
}
