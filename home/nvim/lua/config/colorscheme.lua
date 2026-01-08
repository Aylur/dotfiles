vim.pack.add({
	"https://github.com/aylur/nucharm.nvim",
})

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

vim.cmd("colorscheme nucharm")
