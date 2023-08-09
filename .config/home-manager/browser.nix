{
  home = {
    sessionVariables.BROWSER = "firefox";

    file."firefox-gnome-theme" = {
      target = ".mozilla/firefox/default/chrome/firefox-gnome-theme";
      source = (fetchTarball {
            url = "https://github.com/rafaelmardojai/firefox-gnome-theme/archive/master.tar.gz";
            sha256 = "1i3zhxbma5wg861i05ls3npmsy3i9rk8c1r86xb26icnmnfvk16h";
        });
    };
  };

  programs = {
    chromium.enable = true;

    firefox = {
      enable = true;
      profiles.default = {
        name = "Default";
        settings = {
          "extensions.activeThemeID" = "firefox-compact-dark@mozilla.org";
          "toolkit.legacyUserProfileCustomizations.stylesheets" = true;
          # "browser.tabs.drawInTitlebar" = true;
          "svg.context-properties.content.enabled" = true;
          "gnomeTheme.normalWidthTabs" = true;
          "gnomeTheme.tabsAsHeaderbar" = true;
        };
        userChrome = ''
          @import "firefox-gnome-theme/userChrome.css";
        @import "firefox-gnome-theme/theme/colors/dark.css"; 
        '';
      };
    };
  };
}
