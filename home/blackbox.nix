{
  pkgs,
  lib,
  ...
}: let
  colors = let
    colors = scheme: {
      foreground-color = scheme.fg;
      background-color = scheme.bg;
      use-theme-colors = true;
      use-highlight-color = true;
      highlight-foreground-color = scheme.selection.fg;
      highlight-background-color = scheme.selection.bg;
      use-cursor-color = true;
      cursor-foreground-color = scheme.cursor.bg;
      cursor-background-color = scheme.cursor.fg;
      palette = scheme.ansi ++ scheme.bright_ansi;
    };
  in {
    "Charmful Dark" = colors (import ./colors.nix {scheme = "dark";});
    "Charmful Light" = colors (import ./colors.nix {scheme = "light";});
  };
in {
  home = {
    packages = [
      pkgs.blackbox-terminal
      (pkgs.writeShellScriptBin "kgx" ''${pkgs.blackbox-terminal}/bin/blackbox $@'')
      (pkgs.writeShellScriptBin "gnome-terminal" ''${pkgs.blackbox-terminal}/bin/blackbox $@'')
    ];

    file = let
      mkScheme = name: {
        ".local/share/blackbox/schemes/${lib.strings.sanitizeDerivationName name}.json" = {
          text = builtins.toJSON (colors.${name} // {inherit name;});
        };
      };
    in
      builtins.foldl' (acc: x: acc // x) {} (map mkScheme (builtins.attrNames colors));
  };

  dconf.settings = {
    "com/github/stunkymonkey/nautilus-open-any-terminal" = {
      terminal = "blackbox";
    };
    "com/raggesilver/BlackBox" = {
      command-as-login-shell = true;
      custom-shell-command = "${pkgs.tmux}/bin/tmux";
      use-custom-command = true;
      font = "CaskaydiaCove Nerd Font 12";
      fill-tabs = true;
      show-headerbar = false;
      pretty = true;
      theme-light = "Charmful Light";
      theme-dark = "Charmful Dark";
      terminal-padding = with lib.hm.gvariant; let
        p = mkUint32 18;
      in
        mkTuple [p p p p];
    };
  };
}
