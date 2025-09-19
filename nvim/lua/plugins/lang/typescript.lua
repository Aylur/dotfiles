return {
	{ "nvim-mini/mini.icons" },
	{ "roobert/tailwindcss-colorizer-cmp.nvim", opts = {} },
	{ import = "lazyvim.plugins.extras.linting.eslint" },
	{ import = "lazyvim.plugins.extras.lang.typescript" },
	{ import = "lazyvim.plugins.extras.lang.tailwind" },
	{ import = "lazyvim.plugins.extras.lang.astro" },
	{ import = "lazyvim.plugins.extras.lang.svelte" },
	-- { import = "lazyvim.plugins.extras.lang.vue" },
	{
		"stevearc/conform.nvim",
		opts = {
			formatters_by_ft = {
				javascript = { "prettier" },
				typescript = { "prettier" },
				typescriptreact = { "prettier" },
				javascriptreact = { "prettier" },
				["typescript.jsx"] = { "prettier" },
				["javascript.jsx"] = { "prettier" },
				css = { "prettier" },
				scss = { "prettier" },
				json = { "prettier" },
				astro = { "prettier" },
				svelte = { "prettier" },
				vue = { "prettier" },
				graphql = { "prettier" },
				yaml = { "prettier" },
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
	{
		"neovim/nvim-lspconfig",
		opts = {
			setup = {
				tailwindcss = function(_, opts)
					opts.settings = {
						tailwindCSS = {
							classFunctions = { "clsx" },
						},
					}
				end,
			},
		},
	},
	{
		"themaxmarchuk/tailwindcss-colors.nvim",
		opts = {},
	},
}
