return {
	{
		"aylur/nucharm.nvim",
		config = function()
			local scheme = vim.fn.system({
				"gsettings",
				"get",
				"org.gnome.desktop.interface",
				"color-scheme",
			})

			if vim.fn.trim(scheme, "") == "'prefer-dark'" then
				vim.opt.background = "dark"
			else
				vim.opt.background = "light"
			end

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
