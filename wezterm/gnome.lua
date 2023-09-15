local fg = "#171717"
local bg = "#fffffa"
local bright_fg = "#242526"
local bright_bg = "#e7e8e9"
local white = "#d3d4d5"

return {
	background = bg,
	foreground = fg,
	cursor_bg = fg,
	cursor_fg = black,
	cursor_border = fg,
	selection_fg = black,
	selection_bg = fg,
	scrollbar_thumb = fg,
	split = white,
	ansi = {
		bright_bg,
		"#f66151",
		"#33d17a",
		"#f6d32d",
		"#62a0ea",
		"#9141ac",
		"#47b496",
		bright_fg,
	},
	brights = {
		white,
		"#dd5742",
		"#29bd6b",
		"#ddbf23",
		"#5891d6",
		"#82379d",
		"#3da087",
		fg,
	},
}
