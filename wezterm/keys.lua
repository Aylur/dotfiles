local wezterm = require("wezterm")
local wa = wezterm.action

wezterm.on("padding-off", function(window)
	local overrides = window:get_config_overrides() or {}
	if not overrides.window_padding then
		overrides.window_padding = {
			top = "0",
			right = "0",
			bottom = "0",
			left = "0",
		}
	else
		overrides.window_padding = nil
	end
	window:set_config_overrides(overrides)
end)

wezterm.on("toggle-opacity", function(window)
	local overrides = window:get_config_overrides() or {}
	if not overrides.window_background_opacity then
		overrides.window_background_opacity = 0.7
	else
		overrides.window_background_opacity = nil
	end
	window:set_config_overrides(overrides)
end)

wezterm.on("toggle-darkmode", function(window)
	local overrides = window:get_config_overrides() or {}
	if overrides.color_scheme == "Gnome Light" then
		overrides.color_scheme = "Charmful Dark"
	else
		overrides.color_scheme = "Gnome Light"
	end
	window:set_config_overrides(overrides)
end)

return {
	{ key = "p", mods = "CTRL", action = wa.EmitEvent("padding-off") },
	{ key = "o", mods = "CTRL", action = wa.EmitEvent("toggle-opacity") },
	{ key = "i", mods = "CTRL", action = wa.EmitEvent("toggle-darkmode") },
}
