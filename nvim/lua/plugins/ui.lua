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

			local prefer = "dark"

			if ok and vim.fn.trim(scheme, "") ~= "'prefer-dark'" then
				vim.opt.background = "light"
				prefer = "light"
			else
				vim.opt.background = "dark"
			end

			require("nucharm").setup({
				on_colors = function(palette)
					if ok and prefer == "dark" then
						palette.neutral[1] = "#111115"
						palette.neutral[2] = "#151519"
						palette.neutral[3] = "#222226"
					end
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
