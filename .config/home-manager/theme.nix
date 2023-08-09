{ pkgs, ... }:
let
  moreWaita = import ./morewaita.nix { inherit pkgs; };
  icon-theme = pkg: name: {
    ".local/share/icons/${name}".source = "${pkgs.${pkg}}/share/icons/${name}";
  };
  gtk-theme = pkg: name: {
    ".local/share/themes/${name}".source = "${pkgs.${pkg}}/share/themes/${name}";
  };
in
{
  home.packages = [ moreWaita ];

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
      ".local/share/icons/MoreWaita-44.1".source = "${moreWaita}/MoreWaita-44.1";
    } //
    icon-theme "papirus-icon-theme" "Papirus" //
    icon-theme "qogir-icon-theme" "Qogir" //
    icon-theme "whitesur-icon-theme" "WhiteSur" //
    icon-theme "colloid-icon-theme" "Colloid" //
    gtk-theme "adw-gtk3" "adw-gtk3" //
    gtk-theme "adw-gtk3" "adw-gtk3-dark";
  };

  gtk = {
    enable = true;
    font.name = "Ubuntu Nerd Font";
    cursorTheme = {
      name = "Qogir";
      package = pkgs.qogir-icon-theme;
    };
    iconTheme.name = "MoreWaita-44.1";
    gtk3.extraCss = ''
      headerbar, .titlebar,
      .csd:not(.popup):not(tooltip):not(messagedialog) decoration{ border-radius: 0; }
    '';
  };

  qt = {
    enable = true;
    platformTheme = "gtk";
    style.name = "adwaita-dark";
  };
}
