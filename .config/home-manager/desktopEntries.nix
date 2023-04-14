{ pkgs, ... }:
{
  xdg.desktopEntries = {
    "org.wezfurlong.wezterm" = {
      name = "WezTerm";
      comment = "Wez's Terminal Emulator";
      icon = "org.wezfurlong.wezterm";
      exec = "nixGL ${pkgs.wezterm}/bin/wezterm start --cwd .";
      categories = [ "System" "TerminalEmulator" "Utility" ];
      terminal = false;
    };
    "code" = {
      categories = [ "Utility" "TextEditor" "Development" "IDE" ];
      comment = "Code Editing. Redefined.";
      exec = "${pkgs.vscode}/bin/code %F";
      genericName = "Text Editor";
      icon = "code";
      mimeType = [ "text/plain" "inode/directory" ];
      name = "Visual Studio Code";
      startupNotify = true;
      type = "Application";
    };
  };
}
