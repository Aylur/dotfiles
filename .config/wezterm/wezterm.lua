local wezterm = require 'wezterm'

local custom = wezterm.color.get_builtin_schemes()["Catppuccin Frappe"]
custom.background = "#1A1A1A"

wezterm.on('padding-off', function(window, pane)
  local overrides = window:get_config_overrides() or {}
  if not overrides.window_padding then
    overrides.window_padding = {
      top    = '0',
      right  = '0',
      bottom = '0',
      left   = '0',
    }
  else
    overrides.window_padding = nil
  end
  window:set_config_overrides(overrides)
end)

wezterm.on('toggle-opacity', function(window, pane)
  local overrides = window:get_config_overrides() or {}
  if not overrides.window_background_opacity then
    overrides.window_background_opacity = 0.8
  else
    overrides.window_background_opacity = nil
  end
  window:set_config_overrides(overrides)
end)

return {
  color_schemes = { ["Myppuccin"] = custom, },
  color_scheme = "Myppuccin",
  use_fancy_tab_bar = true,
  colors = {
    tab_bar = {
      background = '#333333',
      active_tab = {
        bg_color = '#1A1A1A',
        fg_color = '#fefefe',
        intensity = 'Bold', -- "Half" "Normal" "Bold"
        underline = 'None', -- "None" "Single" "Double"
        italic = false,
        strikethrough = false,
      },
      inactive_tab = {
        bg_color = '#333333',
        fg_color = '#d1d1d1',
      },
      new_tab = {
        bg_color = '#1e1e1e',
        fg_color = '#fefefe',
      },
      inactive_tab_hover = {
        bg_color = '#3f3f3f',
        fg_color = '#e1e1e1',
        italic = false,
      },
      new_tab_hover = {
        bg_color = '#3f3f3f',
        fg_color = '#e1e1e1',
        italic = false,
      },
    },
  },
  window_frame = {
    active_titlebar_bg = '#333333',
    inactive_titlebar_bg = '#333333',
  },

  font = wezterm.font 'CaskaydiaCove NF',

  default_prog = { 'zsh' },
  window_close_confirmation = 'NeverPrompt',
  hide_tab_bar_if_only_one_tab = true,

  enable_scroll_bar = false;
  window_padding = {
    top    = '1cell',
    right  = '1cell',
    bottom = '1cell',
    left   = '1cell',
  },

  inactive_pane_hsb = {
    saturation = 0.9,
    brightness = 0.8,
  },

  window_background_opacity = 1.0,
  text_background_opacity = 1.0,

  keys = {
    { key = 'LeftArrow',  mods = 'ALT', action = wezterm.action.ActivateTabRelative(-1) },
    { key = 'RightArrow', mods = 'ALT', action = wezterm.action.ActivateTabRelative(1) },
    { key = 'LeftArrow',  mods = 'CTRL|SHIFT', action = wezterm.action.ActivateTabRelative(-1) },
    { key = 'RightArrow', mods = 'CTRL|SHIFT', action = wezterm.action.ActivateTabRelative(1) },
    { key = '1', mods = 'ALT', action = wezterm.action.ActivateTab(0) },
    { key = '2', mods = 'ALT', action = wezterm.action.ActivateTab(1) },
    { key = '3', mods = 'ALT', action = wezterm.action.ActivateTab(2) },
    { key = '4', mods = 'ALT', action = wezterm.action.ActivateTab(3) },
    { key = '5', mods = 'ALT', action = wezterm.action.ActivateTab(4) },
    { key = 'h', mods = 'CTRL|SHIFT', action = wezterm.action.ActivatePaneDirection 'Left'},
    { key = 'j', mods = 'CTRL|SHIFT', action = wezterm.action.ActivatePaneDirection 'Down'},
    { key = 'k', mods = 'CTRL|SHIFT', action = wezterm.action.ActivatePaneDirection 'Up'},
    { key = 'l', mods = 'CTRL|SHIFT', action = wezterm.action.ActivatePaneDirection 'Right'},
    { key = 'p', mods = 'CTRL', action = wezterm.action.EmitEvent 'padding-off' },
    { key = 'o', mods = 'CTRL', action = wezterm.action.EmitEvent 'toggle-opacity' },
  },
}
