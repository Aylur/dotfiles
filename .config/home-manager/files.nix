with builtins;
let
  nix-share = "${getEnv "HOME"}/.nix-profile/share/";
  copy = path: source: if pathExists (nix-share + source) then {
    "${path}" = {
      recursive = true;
      source = nix-share + source;
    };
  }
  else {};
  copy-icon = icon: copy ".local/share/icons/${icon}" "icons/${icon}";
  copy-theme = theme: copy ".local/share/themes/${theme}" "themes/${theme}";
in
{
  home.file = 
    copy-icon "Qogir" //
    copy-icon "Colloid" //
    copy-icon "WhiteSur" //
    copy-icon "Papirus" //
    copy-theme "adw-gtk3" //
    copy-theme "adw-gtk3-dark" //
    copy ".local/share/fonts" "fonts/truetype/NerdFonts" //
    copy ".fonts" "fonts/truetype/NerdFonts";
}
