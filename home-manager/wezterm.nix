{ pkgs, ... }:
{
  programs.wezterm.enable = true;

  xdg.configFile.wezterm.source = ../wezterm;

  xdg.desktopEntries."org.wezfurlong.wezterm" = {
    name = "WezTerm";
    comment = "Wez's Terminal Emulator";
    icon = "org.wezfurlong.wezterm";
    exec = "${pkgs.nixgl.nixGLIntel}/bin/nixGLIntel ${pkgs.wezterm}/bin/wezterm start --cwd .";
    categories = [ "System" "TerminalEmulator" "Utility" ];
    terminal = false;
  };
}
