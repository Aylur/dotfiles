{
  inputs,
  pkgs,
  lib,
  ...
}: let
  new =
    pkgs.writers.writeNuBin "new" {}
    # nu
    ''
      def main [filename: string] {
        let target = $"($env.PWD)/($filename)"
        if ($filename | str ends-with "/") {
          mkdir $target
        } else {
          touch $target
        }
      }
    '';

  trash =
    pkgs.writers.writeNu "lf-trash" {}
    # nu
    ''
      let files = $env.fx | split row "\n"
      gio trash ...$files
    '';
in {
  xdg.desktopEntries = lib.mkIf pkgs.stdenv.isLinux {
    "lf" = {
      name = "lf";
      noDisplay = true;
    };
  };

  home.packages =
    [new]
    ++ (with pkgs; [
      glib
      fzf
      bat
      zip
      unzip
      gnutar
    ]);

  programs.lf = {
    enable = true;

    commands = {
      trash = "$" + trash;
      delete = "$" + trash;
    };

    keybindings = {
      a = "push %new<space>";
      r = "push :rename<space>";
      d = "trash";
      "." = "set hidden!";
      "<delete>" = "trash";
      "<enter>" = "open";
    };

    settings = {
      scrolloff = 4;
      preview = true;
      drawbox = true;
      icons = true;
      cursorpreviewfmt = "";
      borderfmt = "\\033[30m";
      statfmt = "\\033[33m%p| \\033[34m%s| \\033[0m%t| \\033[33m->\\033[36m%l";
      errorfmt = "\\033[1;31m";
    };
  };

  xdg.configFile."lf/icons".source = "${inputs.lf}/etc/icons_colored.example";
  xdg.configFile."lf/colors".source = "${inputs.lf}/etc/colors.example";
}
