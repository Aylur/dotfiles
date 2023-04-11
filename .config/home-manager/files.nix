{
  home.file = {
    ".local/share/fonts" = {
      recursive = true;
      source = ../../.nix-profile/share/fonts;
    };
    ".config/gtk-4.0/gtk.css" = {
      text = ".background.csd{ border-radius: 12px; }";
    };
    ".config/nushell/config.hu" = {
      source = ./nushell/config.nu;
    };
    ".config/nushell/env.nu" = {
      source = ./nushell/env.nu;
    };
    ".local/share/themes/adw-gtk3" = {
      source = ../../.nix-profile/share/themes/adw-gtk3;
    };
    ".local/share/themes/adw-gtk3-dark" = {
      source = ../../.nix-profile/share/themes/adw-gtk3-dark;
    };
    ".local/share/icons/Qogir-dark" = {
      recursive = true;
      source = ../../.nix-profile/share/icons/Qogir-dark;
    };
     ".local/share/icons/Qogir" = {
      recursive = true;
      source = ../../.nix-profile/share/icons/Qogir;
    };
  };
}
