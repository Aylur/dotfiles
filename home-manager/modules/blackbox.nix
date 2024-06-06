{
  pkgs,
  config,
  lib,
  ...
}: let
  inherit (lib) types;
  inherit (lib.modules) mkIf;
  inherit (lib.options) mkOption mkEnableOption;
  inherit (lib.strings) sanitizeDerivationName;

  cfg = config.terminals.blackbox;
in {
  options.terminals.blackbox = {
    enable = mkEnableOption "blackbox";
    alias = mkOption {
      type = types.listOf types.str;
      default = [];
    };
    sessionVariable = mkOption {
      type = types.bool;
      default = [];
    };
    colors = mkOption {
      type = types.attrs;
      default = {};
    };
    settings = mkOption {
      type = types.attrs;
      default = {};
    };
  };

  config = mkIf cfg.enable {
    home = {
      packages = let
        term = ''${pkgs.blackbox-terminal}/bin/blackbox $@'';
        aliases = map (n: pkgs.writeShellScriptBin n term) cfg.alias;
      in
        [pkgs.blackbox-terminal] ++ aliases;

      sessionVariables.TERMINAL = mkIf cfg.sessionVariable "blackbox";

      file = let
        mkScheme = name: {
          ".local/share/blackbox/schemes/${sanitizeDerivationName name}.json" = {
            text = builtins.toJSON (cfg.colors.${name} // {inherit name;});
          };
        };
      in
        builtins.foldl' (acc: x: acc // x) {} (map mkScheme (builtins.attrNames cfg.colors));
    };

    dconf.settings = {
      "com/raggesilver/BlackBox" = cfg.settings;
      "com/github/stunkymonkey/nautilus-open-any-terminal".terminal = "blackbox";
    };
  };
}
