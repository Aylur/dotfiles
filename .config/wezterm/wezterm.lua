local wezterm = require 'wezterm'
require('events')

return {
  -- color_schemes = {
  --   ["Myppuccin"] = require('myppuccin'),
  --   ["Charm"] = require('charm'),
  --   ["Decay"] = require('decay'),
  -- },

  colors = require('charm'),
  window_frame = {
    active_titlebar_bg = '#333333',
    inactive_titlebar_bg = '#333333',
  },
  use_fancy_tab_bar = true,
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

  keys = require('keys')
}
