local prettier = { "prettierd", "prettier", stop_after_first = true }

return {
	{ "roobert/tailwindcss-colorizer-cmp.nvim", opts = {} },
	{
		"stevearc/conform.nvim",
		opts = {
			formatters_by_ft = {
				javascript = prettier,
				typescript = prettier,
				typescriptreact = prettier,
				javascriptreact = prettier,
				["typescript.jsx"] = prettier,
				["javascript.jsx"] = prettier,
				css = prettier,
				scss = prettier,
			},
		},
	},
	{
		"neovim/nvim-lspconfig",
		opts = {
			servers = {
				vtsls = {},
				eslint = {},
				tailwindcss = {},
			},
		},
	},
	{
		"nvim-treesitter/nvim-treesitter",
		opts = {
			ensure_installed = {
				"typescript",
				"javascript",
				"jsdoc",
				"vue",
				"svelte",
			},
		},
	},
}
