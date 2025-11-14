{pkgs, ...}: {
  home.packages = [
    pkgs.ghostty
    (pkgs.writeShellScriptBin "xterm" ''${pkgs.ghostty}/bin/ghostty "$@"'')
  ];

  xdg.configFile = {
    "ghostty/config".text = ''
      command = ${pkgs.tmux}/bin/tmux
      font-family = CaskaydiaCove Nerd Font
      font-feature = liga
      font-feature = calt
      theme = light:nucharm-light,dark:nucharm-dark
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

    # TODO: move this into nucharm.nvim repo
    "ghostty/themes/nucharm-dark".text = ''
      background = #151519
      foreground = #b2b5b3
      selection-background = #EBFF71
      selection-foreground = #313234
      cursor-color = #eaeaea
      cursor-text = #373839
      palette = 0=#373839
      palette = 1=#e55f86
      palette = 2=#00D787
      palette = 3=#EBFF71
      palette = 4=#50a4e7
      palette = 5=#9076e7
      palette = 6=#50e6e6
      palette = 7=#e7e7e7
      palette = 8=#313234
      palette = 9=#d15577
      palette = 10=#43c383
      palette = 11=#d8e77b
      palette = 12=#4886c8
      palette = 13=#8861dd
      palette = 14=#43c3c3
      palette = 15=#c1c4c2
    '';

    "ghostty/themes/nucharm-light".text = ''
      background = #fafafa
      foreground = #171717
      selection-background = #f6d32d
      selection-foreground = #313234
      cursor-color = #171717
      cursor-text = #fafafa
      palette = 0=#afafb0
      palette = 1=#f66151
      palette = 2=#33d17a
      palette = 3=#f6d32d
      palette = 4=#62a0ea
      palette = 5=#9141ac
      palette = 6=#47b496
      palette = 7=#3b3c3d
      palette = 8=#bdbebf
      palette = 9=#dd5742
      palette = 10=#29bd6b
      palette = 11=#ddbf23
      palette = 12=#5891d6
      palette = 13=#82379d
      palette = 14=#3da087
      palette = 15=#2d2d2e
    '';
  };
}
