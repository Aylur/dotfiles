return {
    enable_wayland = false,
    color_schemes = {
        ["Gnome Light"] = require("gnome"),
        ["Charmful Dark"] = require("charmful"),
    },
    color_scheme = "Charmful Dark",
    font = require("wezterm").font("CaskaydiaCove NF"),
    cell_width = 0.9,
    default_cursor_style = "BlinkingBar",

    default_prog = { "tmux" },
    window_close_confirmation = "NeverPrompt",
    hide_tab_bar_if_only_one_tab = true,

    window_padding = {
        top = "1cell",
        right = "3cell",
        bottom = "1cell",
        left = "3cell",
    },

    inactive_pane_hsb = {
        saturation = 0.9,
        brightness = 0.8,
    },

    window_background_opacity = 1.0,
    text_background_opacity = 1.0,

    keys = require("keys"),
}
