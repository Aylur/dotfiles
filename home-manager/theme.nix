{ pkgs, ... }:
let
  gtk-theme = "adw-gtk3-dark";

  nerdfonts = (pkgs.nerdfonts.override { fonts = [
    "Ubuntu"
    "UbuntuMono"
    "CascadiaCode"
    "FantasqueSansMono"
    "FiraCode"
    "Mononoki"
  ]; });

  cursor-theme = "Qogir";
  cursor-package = pkgs.qogir-icon-theme;
in
{
  home = {
    packages = with pkgs; [
      adw-gtk3
      font-awesome
      nerdfonts
      morewaita-icon-theme
      # papirus-icon-theme
      # qogir-icon-theme
      # whitesur-icon-theme
      # colloid-icon-theme
      # qogir-theme
      # yaru-theme
      # whitesur-gtk-theme
      # orchis-theme
    ];
    sessionVariables = {
      XCURSOR_THEME = cursor-theme;
      XCURSOR_SIZE = "24";
    };
    pointerCursor = {
      package = cursor-package;
      name = cursor-theme;
      size = 24;
      gtk.enable = true;
    };
    file = {
      ".local/share/fonts" = {
        recursive = true;
        source = "${nerdfonts}/share/fonts/truetype/NerdFonts";
      };
      ".fonts" = {
        recursive = true;
        source = "${nerdfonts}/share/fonts/truetype/NerdFonts";
      };
      ".config/gtk-4.0/gtk.css" = {
        text = ''
          window.messagedialog .response-area > button,
          window.dialog.message .dialog-action-area > button,
          .background.csd{
            border-radius: 0;
          }
        '';
      };
    };
  };

  gtk = {
    enable = true;
    font.name = "Ubuntu Nerd Font";
    theme.name = gtk-theme;
    cursorTheme = {
      name = cursor-theme;
      package = cursor-package;
    };
    iconTheme.name = "MoreWaita";
    gtk3.extraCss = ''
      headerbar, .titlebar,
      .csd:not(.popup):not(tooltip):not(messagedialog) decoration{
        border-radius: 0;
      }
    '';
  };

  qt = {
    enable = true;
    platformTheme = "kde";
  };
}
