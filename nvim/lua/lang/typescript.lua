local prettier = { "prettierd", "prettier", stop_after_first = true }

return {
	{ "echasnovski/mini.icons" },
	{ "roobert/tailwindcss-colorizer-cmp.nvim", opts = {} },
	{ import = "lazyvim.plugins.extras.lang.typescript" },
	{ import = "lazyvim.plugins.extras.lang.json" },
	{ import = "lazyvim.plugins.extras.lang.tailwind" },
	{ import = "lazyvim.plugins.extras.lang.svelte" },
	{ import = "lazyvim.plugins.extras.lang.vue" },
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
				json = prettier,
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
