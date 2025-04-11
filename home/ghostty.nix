{
  pkgs,
  lib,
  ...
}: let
  inherit (lib.modules) mkIf;
  inherit (pkgs.stdenv) isLinux;

  colors = scheme: ''
    background = ${scheme.bg}
    foreground = ${scheme.fg}
    selection-background = ${scheme.selection.bg}
    selection-foreground = ${scheme.selection.fg}
    cursor-color = ${scheme.cursor.bg}
    cursor-text = ${scheme.cursor.fg}
    palette = 0=${scheme.black}
    palette = 1=${scheme.red}
    palette = 2=${scheme.green}
    palette = 3=${scheme.yellow}
    palette = 4=${scheme.blue}
    palette = 5=${scheme.magenta}
    palette = 6=${scheme.cyan}
    palette = 7=${scheme.white}
    palette = 8=${scheme.bright.black}
    palette = 9=${scheme.bright.red}
    palette = 10=${scheme.bright.green}
    palette = 11=${scheme.bright.yellow}
    palette = 12=${scheme.bright.blue}
    palette = 13=${scheme.bright.magenta}
    palette = 14=${scheme.bright.cyan}
    palette = 15=${scheme.bright.white}
  '';
in {
  home.packages = mkIf isLinux [
    pkgs.ghostty
    (pkgs.writeShellScriptBin "xterm" ''${pkgs.ghostty}/bin/ghostty "$@"'')
  ];

  home.sessionVariables.TERMINAL = "ghostty";

  xdg.configFile = {
    "ghostty/config".text = ''
      command = ${pkgs.tmux}/bin/tmux
      font-family = CaskaydiaCove Nerd Font
      font-feature = liga
      font-feature = calt
      theme = light:charmful-light,dark:charmful-dark
      window-padding-x = 12
      window-padding-y = 6
      window-decoration = auto
      window-theme = system
      window-height = 26
      window-width = 90
      copy-on-select = true
      gtk-single-instance = false
      gtk-titlebar = false
      confirm-close-surface = false

      # using tmux instead
      keybind = alt+one=unbind
      keybind = alt+two=unbind
      keybind = alt+three=unbind
      keybind = alt+four=unbind

      keybind = ctrl+shift+minus=decrease_font_size:1
      keybind = ctrl+shift+minus=decrease_font_size:1
    '';

    "ghostty/themes/charmful-dark".text = colors (import ./colors.nix {scheme = "dark";});
    "ghostty/themes/charmful-light".text = colors (import ./colors.nix {scheme = "light";});
  };
}
