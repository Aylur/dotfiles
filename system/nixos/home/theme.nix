{
  pkgs,
  config,
  ...
}: {
  home.packages = with pkgs; [
    adw-gtk3
    nerd-fonts.ubuntu
    qogir-icon-theme
    morewaita-icon-theme
    nerd-fonts.caskaydia-cove
    yaru-theme
    papirus-icon-theme
  ];

  fonts.fontconfig.enable = true;

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
