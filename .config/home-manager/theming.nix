{ pkgs, ... }:
{
  home.packages = with pkgs; [
    # fonts
    (nerdfonts.override { fonts = [
      "Ubuntu"
      "UbuntuMono"
      "CascadiaCode"
      "FantasqueSansMono"
      "FiraCode"
      "VictorMono"
      "Mononoki"
    ]; })
    font-awesome

    # themes
    qogir-theme #gtk
    papirus-icon-theme
    qogir-icon-theme
    whitesur-icon-theme
    colloid-icon-theme
    adw-gtk3
  ];

  home = {
    pointerCursor = {
      package = pkgs.qogir-icon-theme;
      name = "Qogir";
      size = 24;
      gtk.enable = true;
    };
    file = {
      ".config/gtk-4.0/gtk.css" = {
        text = ''
        window.messagedialog .response-area > button,
        window.dialog.message .dialog-action-area > button,
          .background.csd{ border-radius: 0; }
        '';
      };
    };
  };

  gtk = {
    enable = true;
    font.name = "Ubuntu Nerd Font";
    cursorTheme = {
      name = "Qogir";
      package = pkgs.qogir-icon-theme;
    };
    gtk3 = {
      bookmarks = [
        "file:///home/demeter/Documents"
        "file:///home/demeter/Music"
        "file:///home/demeter/Pictures"
        "file:///home/demeter/Videos"
        "file:///home/demeter/Downloads"
        "file:///home/demeter/Projects Projects"
        "file:///home/demeter/School School"
      ];
      extraCss = ''
        headerbar, .titlebar,
        .csd:not(.popup):not(tooltip):not(messagedialog) decoration{ border-radius: 0; }
      '';
    };
  };

}
