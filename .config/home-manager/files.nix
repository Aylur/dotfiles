{ pkgs, ... }:
{
  home.file = {
    ".local/share/fonts" = {
      recursive = true;
      source = /home/demeter/.nix-profile/share/fonts;
    };
    ".local/share/themes/adw-gtk3" = {
      source = /home/demeter/.nix-profile/share/themes/adw-gtk3;
    };
    ".local/share/themes/adw-gtk3-dark" = {
      source = /home/demeter/.nix-profile/share/themes/adw-gtk3-dark;
    };
    ".local/share/icons/Qogir-dark" = {
      recursive = true;
      source = /home/demeter/.nix-profile/share/icons/Qogir-dark;
    };
     ".local/share/icons/Qogir" = {
      recursive = true;
      source = /home/demeter/.nix-profile/share/icons/Qogir;
    };
  };
}
