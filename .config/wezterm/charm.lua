local bg = '#171717'
local fg = '#b2b5b3'
local bright_bg = '#373839'
local bright_fg = '#e7e7e7'
local black = '#313234'
local white = '#f3f3f3'

return {
  tab_bar = {
    background = black,
    active_tab = {
      bg_color = bg,
      fg_color = bright_fg,
      intensity = 'Bold', -- "Half" "Normal" "Bold"
      underline = 'None', -- "None" "Single" "Double"
      italic = false,
      strikethrough = false,
    },
    inactive_tab = {
      bg_color = black,
      fg_color = fg,
    },
    new_tab = {
      bg_color = '#1e1e1e',
      fg_color = fg,
    },
    inactive_tab_hover = {
      bg_color = black,
      fg_color = bright_fg,
      italic = false,
    },
    new_tab_hover = {
      bg_color = black,
      fg_color = bright_fg,
      italic = false,
    },
  },
  background = bg,
  foreground = fg,
  cursor_bg = fg,
  cursor_fg = black,
  cursor_border = fg,
  selection_fg = black,
  selection_bg = fg,
  scrollbar_thumb = fg,
  split = black,
  ansi = {
    bright_bg,
    '#e67089',
    '#42c383',
    '#d7e77b',
    '#50a4e7',
    '#9076e7',
    '#50e6e6',
    bright_fg,
  },
  brights = {
    black,
    '#c35d72',
    '#46a96f',
    '#c1cf6c',
    '#448fc6',
    '#8860dd',
    '#42c3c3',
    fg,
  },
}
