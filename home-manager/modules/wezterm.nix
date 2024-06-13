{
  pkgs,
  config,
  lib,
  ...
}: let
  inherit (lib) types;
  inherit (lib.modules) mkIf;
  inherit (lib.options) mkOption mkEnableOption;

  cfg = config.terminals.wezterm;

  toLuaTable = with builtins;
    value:
      if isBool value
      then
        if value
        then "true"
        else "false"
      else if isString value
      then toJSON value
      else if isInt value || isFloat value
      then toString value
      else if isList value
      then ''{ ${concatStringsSep ", " (map toLuaTable value)} }''
      else if isAttrs value
      then ''{ ${concatStringsSep ", " (map (k: ''["${k}"] = ${toLuaTable value.${k}}'') (attrNames value))} }''
      else throw "Unsupported type: ${typeOf value}";
in {
  options.terminals.wezterm = {
    enable = mkEnableOption "wezterm";
    alias = mkOption {
      type = types.listOf types.str;
      default = [];
    };
    sessionVariable = mkOption {
      type = types.bool;
      default = false;
    };
    font = mkOption {
      type = types.nullOr types.str;
      default = null;
    };
    themes = mkOption {
      type = types.attrsOf types.str;
      default = {};
    };
    settings = mkOption {
      type = types.attrs;
      default = {};
    };
    extraLua = mkOption {
      type = types.str;
      default = "";
    };
  };

  config = mkIf cfg.enable {
    home = {
      packages = mkIf pkgs.stdenv.isLinux (let
        term = ''${pkgs.wezterm}/bin/wezterm "$@"'';
        aliases = map (n: pkgs.writeShellScriptBin n term) cfg.alias;
      in
        [pkgs.wezterm] ++ aliases);

      sessionVariables.TERMINAL = mkIf cfg.sessionVariable "wezterm";
    };

    xdg.configFile."wezterm/wezterm.lua".text = let
      wayland_scheme = ''
        local themes = ${toLuaTable cfg.themes}

        function get_appearance()
          if wezterm.gui then
            return wezterm.gui.get_appearance()
          end
          return "Dark"
        end

        function scheme_for_appearance(appearance)
          if appearance:find 'Dark' then
            return themes.Dark or ""
          else
            return themes.Light or ""
          end
        end

        config.color_scheme = scheme_for_appearance(get_appearance())
      '';
    in ''
      local wezterm = require "wezterm"
      local config = ${toLuaTable cfg.settings}
      ${cfg.extraLua}

      ${
        if cfg.font != null
        then ''config.font = wezterm.font("${cfg.font}")''
        else ""
      }

      ${
        if pkgs.stdenv.isLinux
        then wayland_scheme
        else ""
      }

      return config
    '';
  };
}
