{
  pkgs,
  config,
  ...
}: let
  theme = {
    name = "adw-gtk3-dark";
    package = pkgs.adw-gtk3;
  };
  font = {
    name = "Ubuntu Nerd Font";
    package = pkgs.nerd-fonts.ubuntu;
    size = 11;
  };
  cursorTheme = {
    name = "Qogir";
    size = 24;
    package = pkgs.qogir-icon-theme;
  };
  iconTheme = {
    name = "MoreWaita";
    package = pkgs.morewaita-icon-theme;
  };
in {
  home = {
    packages = with pkgs; [
      theme.package
      font.package
      cursorTheme.package
      iconTheme.package
      nerd-fonts.caskaydia-cove
    ];
    # sessionVariables = {
    #   XCURSOR_THEME = cursorTheme.name;
    #   XCURSOR_SIZE = "${toString cursorTheme.size}";
    # };
    # pointerCursor = cursorTheme // {gtk.enable = true;};
  };

  fonts.fontconfig.enable = true;

  # gtk = {
  #   inherit font cursorTheme iconTheme;
  #   theme.name = theme.name;
  #   enable = true;
  # };
  #
  # qt = {
  #   enable = true;
  #   platformTheme.name = "kde";
  # };

  home.file.".local/share/flatpak/overrides/global".text = let
    dirs = [
      "/nix/store:ro"
      "xdg-config/gtk-3.0:ro"
      "xdg-config/gtk-4.0:ro"
      "${config.xdg.dataHome}/icons:ro"
    ];
  in ''
    [Context]
    filesystems=${builtins.concatStringsSep ";" dirs}
  '';
}
