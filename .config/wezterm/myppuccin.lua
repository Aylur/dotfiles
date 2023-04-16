local wezterm = require 'wezterm'

local theme = wezterm.color.get_builtin_schemes()["Catppuccin Frappe"]
theme.background = "#1A1A1A"

theme.tab_bar = {
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
}

return theme
