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

			if vim.fn.trim(scheme, "") ~= "'prefer-dark'" then
				vim.opt.background = "light"
			else
				vim.opt.background = "dark"
			end

			require("nucharm").setup({
				on_colors = function(palette)
					palette.neutral[1] = "#111115"
					palette.neutral[2] = "#151519"
					palette.neutral[3] = "#222226"
				end,
			})

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
