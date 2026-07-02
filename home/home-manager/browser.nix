inputs: {
  programs.chromium.enable = true;

  home.file = {
    ".mozilla/firefox/default/chrome/firefox-gnome-theme" = {
      source = inputs.inputs.firefox-gnome-theme;
    };
  };

  # TODO: migrate to XDG
  # xdg.configFile = {
  #   "mozilla/firefox/default/chrome/firefox-gnome-theme" = {
  #     source = inputs.inputs.firefox-gnome-theme;
  #   };
  # };

  programs.firefox = {
    enable = true;
    # configPath = "${inputs.config.xdg.configHome}/mozilla/firefox";
    configPath = "${inputs.config.home.homeDirectory}/.mozilla/firefox";
    profiles.default = {
      name = "Default";
      settings = {
        "browser.tabs.loadInBackground" = true;
        "widget.gtk.rounded-bottom-corners.enabled" = true;
        "widget.disable-swipe-tracker" = true;
        "toolkit.legacyUserProfileCustomizations.stylesheets" = true;
        "svg.context-properties.content.enabled" = true;
        "gnomeTheme.hideSingleTab" = true;
        "gnomeTheme.bookmarksToolbarUnderTabs" = true;
        "gnomeTheme.normalWidthTabs" = false;
        "gnomeTheme.tabsAsHeaderbar" = false;
        "browser.fullscreen.autohide" = false;
      };
      userChrome = ''
        @import "firefox-gnome-theme/userChrome.css";
      '';
      userContent = ''
        @import "firefox-gnome-theme/userContent.css";
      '';
    };
  };
}
