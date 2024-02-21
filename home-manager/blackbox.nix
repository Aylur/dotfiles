{ pkgs, ... }:
let
  xterm = pkgs.writeShellScriptBin "xterm" ''
    ${pkgs.blackbox-terminal}/bin/blackbox "$@"
  '';
in
{
  home = {
    packages = with pkgs; [
      blackbox-terminal
      # xterm
    ];
    sessionVariables.TERMINAL = "blackbox";
  };

  home.file.".local/share/blackbox/schemes/charmful.json".text = builtins.toJSON {
    name = "Charmful";
    foreground-color = "#b2b5b3";
    background-color = "#171717";
    use-theme-colors = true;
    use-highlight-color = true;
    highlight-foreground-color = "#ffffff";
    highlight-background-color = "#313234";
    use-cursor-color = true;
    cursor-foreground-color = "#ffffff";
    cursor-background-color = "#e7e7e7";
    use-badge-color = true;
    badge-color = "#ff0000";
    palette = [
        "#373839"
        "#e55f86"
        "#00D787"
        "#EBFF71"
        "#51a4e7"
        "#9077e7"
        "#51e6e6"
        "#e7e7e7"
        "#313234"
        "#d15577"
        "#43c383"
        "#d8e77b"
        "#4886c8"
        "#8861dd"
        "#43c3c3"
        "#b2b5b3"
    ];
  };

  dconf.settings."com/raggesilver/BlackBox" = {
    command-as-login-shell = true;
    custom-shell-command = "${pkgs.tmux}/bin/tmux";
    use-custom-command = true;
    font = "CaskaydiaCove Nerd Font 12";
    fill-tabs = true;
    show-headerbar = false;
    pretty = true;
    theme-light = "Adwaita";
    theme-dark = "Charmful";
  };
}
