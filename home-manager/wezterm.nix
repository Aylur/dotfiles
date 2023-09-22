{ pkgs, ... }:
let
  weztem = "${pkgs.wezterm}/bin/wezterm start --cwd .";
  wez = pkgs.writeShellScriptBin "wez" ''
    if command -v "nixGLIntel" &> /dev/null; then
        nixGLIntel ${weztem} "$@"
    else
        ${weztem} "$@"
    fi
  '';

  substitute = name: pkgs.writeShellScriptBin name ''
    wezterm "$@"
  '';
in 
{
  home = {
    packages = [ wez (substitute "xterm") ];
    sessionVariables.TERMINAL = "wez";
  };

  programs.wezterm.enable = true;
  xdg.configFile.wezterm.source = ../wezterm;

  xdg.desktopEntries."org.wezfurlong.wezterm" = {
    name = "WezTerm";
    comment = "Wez's Terminal Emulator";
    icon = "org.wezfurlong.wezterm";
    exec = "${wez}/bin/wez %F";
    categories = [ "System" "TerminalEmulator" "Utility" ];
    terminal = false;
  };
}
