{
  pkgs,
  lib,
  ...
}: let
  inherit (lib.modules) mkIf;
  inherit (pkgs.stdenv) isLinux;

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

  colors = scheme: {
    background = scheme.bg;
    foreground = scheme.fg;
    cursor_bg = scheme.cursor.bg;
    cursor_fg = scheme.cursor.fg;
    cursor_border = scheme.fg;
    selection_fg = scheme.selection.fg;
    selection_bg = scheme.selection.fg;
    scrollbar_thumb = scheme.fg;
    split = scheme.white;
    ansi = scheme.ansi;
    brights = scheme.bright_ansi;
  };

  scheme_script =
    # lua
    ''
      local function get_appearance()
        if wezterm.gui then
          return wezterm.gui.get_appearance()
        end
        return "Dark"
      end

      local function scheme_for_appearance(appearance)
        if appearance:find "Dark" then
          return "Charmful Dark"
        else
          return "Charmful Light"
        end
      end

      config.color_scheme = scheme_for_appearance(get_appearance())
    '';

  keybindings_script =
    # lua
    ''
      local wa = wezterm.action

      wezterm.on("padding-off", function(window)
      	local overrides = window:get_config_overrides() or {}
      	if not overrides.window_padding then
      		overrides.window_padding = {
      			top = "0",
      			right = "0",
      			bottom = "0",
      			left = "0",
      		}
      	else
      		overrides.window_padding = nil
      	end
      	window:set_config_overrides(overrides)
      end)

      wezterm.on("toggle-opacity", function(window)
      	local overrides = window:get_config_overrides() or {}
      	if not overrides.window_background_opacity then
      		overrides.window_background_opacity = 0.7
      	else
      		overrides.window_background_opacity = nil
      	end
      	window:set_config_overrides(overrides)
      end)

      config.keys = {
      	{ key = "p", mods = "CTRL", action = wa.EmitEvent("padding-off") },
      	{ key = "o", mods = "CTRL", action = wa.EmitEvent("toggle-opacity") },
      }
    '';

  config = toLuaTable {
    enable_wayland = true;
    color_schemes = {
      "Charmful Dark" = colors (import ./colors.nix {scheme = "dark";});
      "Charmful Light" = colors (import ./colors.nix {scheme = "light";});
    };
    cell_width = 0.9;
    default_cursor_style = "BlinkingBar";

    window_close_confirmation = "NeverPrompt";
    hide_tab_bar_if_only_one_tab = true;

    window_padding = {
      top = "1cell";
      right = "3cell";
      bottom = "1cell";
      left = "3cell";
    };

    inactive_pane_hsb = {
      saturation = 0.9;
      brightness = 0.8;
    };

    window_background_opacity = 1.0;
    text_background_opacity = 1.0;

    audible_bell = "Disabled";

    default_prog = ["${pkgs.tmux}/bin/tmux"];
  };
in {
  home.packages = mkIf isLinux [pkgs.wezterm];

  xdg.configFile."wezterm/wezterm.lua".text = ''
    local wezterm = require "wezterm"
    local config = ${config}
    config.font = wezterm.font "CaskaydiaCove NF"
    ${scheme_script}
    ${keybindings_script}
    return config
  '';
}
