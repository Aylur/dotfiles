{ pkgs, ... }:
let
  substitute = name: pkgs.writeShellScriptBin name ''
    ${pkgs.wezterm}/bin/wezterm "$@"
  '';
in
{
  home.packages = [ pkgs.wezterm (substitute "xterm") ];
  programs.wezterm.enable = true;
  xdg.configFile.wezterm.source = ../wezterm;
}
