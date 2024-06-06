{
  pkgs,
  config,
  lib,
  ...
}: {
  options.packages = with lib; let
    packagesType = mkOption {
      type = types.listOf types.package;
      default = [];
    };
  in {
    linux = packagesType;
    darwin = packagesType;
    cli = packagesType;
  };

  config = {
    home.packages = with config.packages;
      if pkgs.stdenv.isDarwin
      then cli ++ darwin
      else cli ++ linux;
  };
}
