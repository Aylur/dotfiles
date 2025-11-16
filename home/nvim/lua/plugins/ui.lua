return {
	{
		"aylur/nucharm.nvim",
		config = function()
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

			require("nucharm").setup()
			vim.cmd("colorscheme nucharm")
		end,
	},
	{
		"folke/snacks.nvim",
		lazy = false,
		opts = {
			dashboard = { enabled = false },
			indent = {
				indent = {
					hl = "LineNr",
					char = "┊",
				},
				scope = {
					hl = "SnacksIndent",
				},
			},
		},
	},
}
