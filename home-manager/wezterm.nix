{ pkgs, ... }:
let
  xterm = pkgs.writeShellScriptBin "xterm" ''
    ${pkgs.wezterm}/bin/wezterm "$@"
  '';
in
{
  home.packages = [
    pkgs.wezterm
    xterm
  ];

  xdg.configFile.wezterm.source = ../wezterm;
}
