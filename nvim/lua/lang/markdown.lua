return {
	{
		"neovim/nvim-lspconfig",
		opts = {
			servers = {
				marksman = {},
			},
		},
	},
	{
		"stevearc/conform.nvim",
		optional = true,
		opts = {
			formatters_by_ft = {
				["markdown"] = { "prettier", "markdownlint-cli2" },
				["markdown.mdx"] = { "prettier", "markdownlint-cli2" },
			},
		},
	},
}
