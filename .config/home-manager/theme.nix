{ pkgs, ... }:
let
  moreWaitaVersion = "44.2";
  moreWaita = pkgs.stdenv.mkDerivation {
    name = "MoreWaita-${moreWaitaVersion}";
    src = pkgs.fetchurl {
      url = "https://github.com/somepaulo/MoreWaita/archive/refs/tags/v${moreWaitaVersion}.zip";
      sha256 = "sha256-Rn0tOlEJa0m33iHVl1mfttsZ8lCnOUpDDro4RykqeZg=";
    };
    dontUnpack = true;
    installPhase = ''
      mkdir -p $out
      ${pkgs.unzip}/bin/unzip $src -d $out
    '';
  };
  nerdfonts = (pkgs.nerdfonts.override { fonts = [
    "Ubuntu"
    "UbuntuMono"
    "CascadiaCode"
    "FantasqueSansMono"
    "FiraCode"
    "VictorMono"
    "Mononoki"
  ]; });
  theme = type: pkg: name: {
    ".local/share/${type}s/${name}".source = "${pkgs.${pkg}}/share/${type}s/${name}";
  };
in
{
  home.packages = [
    nerdfonts
    moreWaita
  ];

  home = {
    pointerCursor = {
      package = pkgs.qogir-icon-theme;
      name = "Qogir";
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
        .background.csd{ border-radius: 0; }
        '';
      };
      ".local/share/icons/MoreWaita-${moreWaitaVersion}" = {
        source = "${moreWaita}/MoreWaita-${moreWaitaVersion}";
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
    cursorTheme = {
      name = "Qogir";
      package = pkgs.qogir-icon-theme;
    };
    iconTheme.name = "MoreWaita-${moreWaitaVersion}";
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
