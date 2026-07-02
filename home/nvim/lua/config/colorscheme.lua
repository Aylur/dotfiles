local ok, scheme = pcall(function()
	return vim.fn.system({
		"gsettings",
		"get",
		"org.gnome.desktop.interface",
		"color-scheme",
	})
end)

if ok and vim.fn.trim(scheme, "") ~= "'prefer-dark'" then
	vim.opt.background = "light"
else
	vim.opt.background = "dark"
end

require("nucharm").setup({
	on_highlights = function(h, c)
		h.Function = { fg = c.blue, bold = true }
		h.Field = { fg = c.blue, bold = true }
		h.Variable = { fg = c.neutral[9], bold = true }
	end,
})

vim.cmd("colorscheme nucharm")
