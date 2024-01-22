{ pkgs, inputs, ... }:
let
  wezterm = inputs.wezterm.packages.${pkgs.system}.default;
  xterm = pkgs.writeShellScriptBin "xterm" ''
    ${wezterm}/bin/wezterm "$@"
  '';
  kgx = pkgs.writeShellScriptBin "kgx" ''
    ${wezterm}/bin/wezterm "$@"
  '';
in
{
  # home.packages = [wezterm xterm kgx];
  xdg.configFile.wezterm.source = ../wezterm;
}
