{pkgs, ...}: let
  wez = ''${pkgs.wezterm}/bin/wezterm "$@"'';
  xterm = pkgs.writeShellScriptBin "xterm" wez;
  kgx = pkgs.writeShellScriptBin "kgx" wez;
in {
  home.packages = [pkgs.wezterm xterm kgx];
  xdg.configFile.wezterm.source = ../wezterm;

  dconf = {
    settings."com/github/stunkymonkey/nautilus-open-any-terminal".terminal = "wezterm";
  };
}
