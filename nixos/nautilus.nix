{
  pkgs,
  lib,
  ...
}: let
  nautEnv = pkgs.buildEnv {
    name = "nautilus-env";

    paths = with pkgs; [
      gnome.nautilus
      gnome.nautilus-python
      nautilus-open-any-terminal
    ];
  };
in {
  environment = {
    systemPackages = [nautEnv];
    pathsToLink = [
      "/share/nautilus-python/extensions"
    ];
    sessionVariables = {
      NAUTILUS_4_EXTENSION_DIR = lib.mkDefault "${nautEnv}/lib/nautilus/extensions-4";
    };
  };
}
