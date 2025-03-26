return {
	{
		"neovim/nvim-lspconfig",
		opts = { servers = { tinymist = {} } },
	},
	{
		"nvim-treesitter/nvim-treesitter",
		opts = { ensure_installed = { "typst" } },
	},
	{
		"stevearc/conform.nvim",
		opts = { formatters_by_ft = { typ = { "typstyle -i" } } },
	},
}
