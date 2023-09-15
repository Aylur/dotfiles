local bg = "#171717"
local fg = "#b2b5b3"
local bright_bg = "#373839"
local bright_fg = "#e7e7e7"
local black = "#313234"

return {
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
        "#e55f86",
        "#00D787",
        "#EBFF71",
		"#51a4e7",
		"#9077e7",
		"#51e6e6",
		bright_fg,
	},
	brights = {
		black,
        "#d15577",
		"#43c383",
		"#d8e77b",
		"#4886c8",
		"#8861dd",
		"#43c3c3",
		fg,
	},
}
