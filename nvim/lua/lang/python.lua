return {
	{
		"neovim/nvim-lspconfig",
		opts = {
			servers = {
				ruff = {},
				pyright = {},
			},
		},
	},
	{
		"nvim-treesitter/nvim-treesitter",
		opts = { ensure_installed = { "ninja", "rst" } },
	},
}
