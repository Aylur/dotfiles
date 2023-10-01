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
in 
{
  home.packages = [ wez ];
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
