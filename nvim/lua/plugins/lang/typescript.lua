return {
	{ "echasnovski/mini.icons" },
	{ "roobert/tailwindcss-colorizer-cmp.nvim", opts = {} },
	{ import = "lazyvim.plugins.extras.linting.eslint" },
	{ import = "lazyvim.plugins.extras.lang.typescript" },
	{ import = "lazyvim.plugins.extras.lang.tailwind" },
	{ import = "lazyvim.plugins.extras.lang.svelte" },
	{ import = "lazyvim.plugins.extras.lang.vue" },
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
							-- FIXME: migrate to classFunctions once nixpkgs updates to >=0.14.10
							-- classFunctions = { "clsx" },
							experimental = {
								classRegex = {
									{ "clsx\\(([^)]*)\\)", "[\"'`]([^\"'`]*)[\"'`]" },
								},
							},
						},
					}
				end,
			},
		},
	},
}
