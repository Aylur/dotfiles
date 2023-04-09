local wezterm = require 'wezterm'
local config = {}

if wezterm.config_builder then
  config = wezterm.config_builder()
end

config.color_scheme = 'Dark+'
config.font = wezterm.font 'CaskaydiaCove NF'
config.default_prog = { 'zsh' }
config.window_close_confirmation = 'NeverPrompt'
config.hide_tab_bar_if_only_one_tab = true
config.window_frame = {
  font = wezterm.font { family = 'CaskaydiaCove NF', weight = 'Bold' },
  font_size = 12.0,
  active_titlebar_bg = '#333333',
  inactive_titlebar_bg = '#242424'
}

config.window_padding = {
  left = 0,
  right = 0,
  top = 0,
  bottom = 0,
}

config.inactive_pane_hsb = {
  saturation = 0.9,
  brightness = 0.8,
}

config.window_background_opacity = 1.0
config.text_background_opacity = 1.0

config.colors = {
  tab_bar = {
    active_tab = {
      bg_color = '#1e1e1e',
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
    inactive_tab_hover = {
      bg_color = '#3f3f3f',
      fg_color = '#e1e1e1',
      italic = false,
    },
    new_tab = {
      bg_color = '#1e1e1e',
      fg_color = '#fefefe',
    },
    new_tab_hover = {
      bg_color = '#3f3f3f',
      fg_color = '#e1e1e1',
      italic = false,
    },
  },
}


config.keys = {
  { key = 'LeftArrow', mods = 'ALT', action = wezterm.action.ActivateTabRelative(-1) },
  { key = 'RightArrow', mods = 'ALT', action = wezterm.action.ActivateTabRelative(1) },
  { key = 'LeftArrow', mods = 'CTRL|SHIFT', action = wezterm.action.ActivateTabRelative(-1) },
  { key = 'RightArrow', mods = 'CTRL|SHIFT', action = wezterm.action.ActivateTabRelative(1) },

}
for i = 1, 8 do
  table.insert(config.keys, {
    key = tostring(i),
    mods = 'ALT',
    action = wezterm.action.ActivateTab(i - 1),
  })
end

return config
