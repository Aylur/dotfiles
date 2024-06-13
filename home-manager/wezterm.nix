{pkgs, ...}: {
  imports = [./modules/wezterm.nix];

  terminals.wezterm = let
    gnome-light = let
      fg = "#171717";
      bg = "#fffffa";
      bright_fg = "#242526";
      bright_bg = "#e7e8e9";
      white = "#d3d4d5";
      black = bg;
    in {
      background = bg;
      foreground = fg;
      cursor_bg = fg;
      cursor_fg = black;
      cursor_border = fg;
      selection_fg = black;
      selection_bg = fg;
      scrollbar_thumb = fg;
      split = white;
      ansi = [
        bright_bg
        "#f66151"
        "#33d17a"
        "#f6d32d"
        "#62a0ea"
        "#9141ac"
        "#47b496"
        bright_fg
      ];
      brights = [
        white
        "#dd5742"
        "#29bd6b"
        "#ddbf23"
        "#5891d6"
        "#82379d"
        "#3da087"
        fg
      ];
    };

    charmful-dark = let
      bg = "#171717";
      fg = "#b2b5b3";
      bright_bg = "#373839";
      bright_fg = "#e7e7e7";
      black = "#313234";
    in {
      background = bg;
      foreground = fg;
      cursor_bg = fg;
      cursor_fg = black;
      cursor_border = fg;
      selection_fg = black;
      selection_bg = fg;
      scrollbar_thumb = fg;
      split = black;
      ansi = [
        bright_bg
        "#e55f86"
        "#00D787"
        "#EBFF71"
        "#51a4e7"
        "#9077e7"
        "#51e6e6"
        bright_fg
      ];
      brights = [
        black
        "#d15577"
        "#43c383"
        "#d8e77b"
        "#4886c8"
        "#8861dd"
        "#43c3c3"
        fg
      ];
    };
  in {
    enable = true;
    font = "CaskaydiaCove NF";

    themes = {
      Dark = "Charmful Dark";
      Light = "Gnome Light";
    };

    settings = {
      enable_wayland = false;
      color_schemes = {
        "Gnome Light" = gnome-light;
        "Charmful Dark" = charmful-dark;
      };
      color_scheme = "Charmful Dark";
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

    extraLua = ''
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
  };
}
