{ pkgs, ... }:
let
  xterm = pkgs.writeShellScriptBin "xterm" ''
    ${pkgs.wezterm}/bin/wezterm "$@"
  '';
  kgx = pkgs.writeShellScriptBin "kgx" ''
    ${pkgs.wezterm}/bin/wezterm "$@"
  '';
in
{
  home.packages = [
    pkgs.wezterm
    xterm
    kgx
  ];

  xdg.configFile.wezterm.source = ../wezterm;
}
