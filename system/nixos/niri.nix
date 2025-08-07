{
  config,
  lib,
  ...
}: {
  options.niri = {
    enable = lib.mkEnableOption "Niri";
  };

  config = lib.mkIf config.niri.enable {
    programs.niri.enable = true;
  };
}
