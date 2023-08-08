local fg = "#171717"
local bg = "#FFFFFF"
local bright_fg = "#373839"
local bright_bg = "#c7c7c7"
local white = "#313234"
local black = "#d3d3d3"

return {
	tab_bar = {
		background = black,
		active_tab = {
			bg_color = bg,
			fg_color = bright_fg,
			intensity = "Bold", -- "Half" "Normal" "Bold"
			underline = "None", -- "None" "Single" "Double"
			italic = false,
			strikethrough = false,
		},
		inactive_tab = {
			bg_color = black,
			fg_color = fg,
		},
		new_tab = {
			bg_color = black,
			fg_color = fg,
		},
		inactive_tab_hover = {
			bg_color = black,
			fg_color = bright_fg,
			italic = false,
		},
		new_tab_hover = {
			bg_color = bg,
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
		"#e67090",
		"#43c383",
		"#d8e77b",
		"#51a4e7",
		"#9077e7",
		"#51e6e6",
		bright_fg,
	},
	brights = {
		black,
		"#c36d72",
		"#47a96f",
		"#c2cf6c",
		"#4381C3",
		"#8861dd",
		"#43c3c3",
		fg,
	},
}
