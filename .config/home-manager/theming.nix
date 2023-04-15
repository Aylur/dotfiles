{ pkgs, ... }:
{
  home.packages = with pkgs; [
    # fonts
    (nerdfonts.override { fonts = [
      "Ubuntu"
      "UbuntuMono"
      "CascadiaCode"
      "Mononoki"
      "Hack"
    ]; })
    rubik

    # themes
    qogir-theme #gtk
    qogir-icon-theme
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
        text = ".background.csd{ border-radius: 12px; }";
      };
    };
 };

  gtk = {
    enable = true;
    font.name = "Ubuntu NF";
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
      extraCss = "headerbar{ border-radius: 0; }";
    };
  };

}
