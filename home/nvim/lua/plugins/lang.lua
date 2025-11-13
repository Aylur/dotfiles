vim.g.lazyvim_check_order = false

return {
	{
		"mason-org/mason.nvim",
		enabled = vim.fn.executable("nix") == 0,
	},
	{
		"mason-org/mason-lspconfig.nvim",
		enabled = vim.fn.executable("nix") == 0,
	},

	{ import = "plugins.lang" },

	{
		"stevearc/conform.nvim",
		opts = {
			formatters_by_ft = {
				xml = { "xmllint --format" },
			},
		},
	},
}
