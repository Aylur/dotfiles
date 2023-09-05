local wezterm = require("wezterm")
local wa = wezterm.action

return {
	{ key = "LeftArrow", mods = "ALT", action = wa.ActivateTabRelative(-1) },
	{ key = "RightArrow", mods = "ALT", action = wa.ActivateTabRelative(1) },
	{ key = "LeftArrow", mods = "CTRL|SHIFT", action = wa.ActivateTabRelative(-1) },
	{ key = "RightArrow", mods = "CTRL|SHIFT", action = wa.ActivateTabRelative(1) },
	{ key = "1", mods = "ALT", action = wa.ActivateTab(0) },
	{ key = "2", mods = "ALT", action = wa.ActivateTab(1) },
	{ key = "3", mods = "ALT", action = wa.ActivateTab(2) },
	{ key = "4", mods = "ALT", action = wa.ActivateTab(3) },
	{ key = "5", mods = "ALT", action = wa.ActivateTab(4) },
	{ key = "h", mods = "CTRL|SHIFT", action = wa.ActivatePaneDirection("Left") },
	{ key = "j", mods = "CTRL|SHIFT", action = wa.ActivatePaneDirection("Down") },
	{ key = "k", mods = "CTRL|SHIFT", action = wa.ActivatePaneDirection("Up") },
	{ key = "l", mods = "CTRL|SHIFT", action = wa.ActivatePaneDirection("Right") },
	{ key = "p", mods = "CTRL", action = wa.EmitEvent("padding-off") },
	{ key = "o", mods = "CTRL", action = wa.EmitEvent("toggle-opacity") },
}
