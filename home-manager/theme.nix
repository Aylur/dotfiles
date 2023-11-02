{ pkgs, inputs, ... }:
let
  moreWaita = pkgs.stdenv.mkDerivation {
    name = "MoreWaita";
    src = inputs.more-waita;
    installPhase = ''
        mkdir -p $out/share/icons
        mv * $out/share/icons
    '';
  };

  nerdfonts = (pkgs.nerdfonts.override { fonts = [
    "Ubuntu"
    "UbuntuMono"
    "CascadiaCode"
    "FantasqueSansMono"
    "FiraCode"
    "Mononoki"
  ]; });

  theme = type: pkg: name: {
    ".local/share/${type}s/${name}".source = "${pkgs.${pkg}}/share/${type}s/${name}";
  };

  cursor-theme = "Qogir";
  cursor-package = pkgs.qogir-icon-theme;
in
{
  home = {
    packages = [
      pkgs.font-awesome
      nerdfonts
      moreWaita
    ];
    sessionVariables.XCURSOR_THEME = cursor-theme;
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
      ".local/share/icons/MoreWaita" = {
        source = "${moreWaita}/share/icons";
      };
    } //
    theme "icon" "papirus-icon-theme" "Papirus" //
    theme "icon" "qogir-icon-theme" "Qogir" //
    theme "icon" "whitesur-icon-theme" "WhiteSur" //
    theme "icon" "colloid-icon-theme" "Colloid" //
    theme "theme" "adw-gtk3" "adw-gtk3" //
    theme "theme" "adw-gtk3" "adw-gtk3-dark";
  };

  gtk = {
    enable = true;
    font.name = "Ubuntu Nerd Font";
    theme.name = "adw-gtk3-dark";
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
    platformTheme = "gtk";
    style.name = "adwaita-dark";
  };
}
