return {
	{
		"b0o/SchemaStore.nvim",
		lazy = true,
		version = false, -- last release is way too old
	},

	{
		"neovim/nvim-lspconfig",
		opts = {
			servers = {
				jsonls = {
					on_new_config = function(new_config)
						new_config.settings.json.schemas = new_config.settings.json.schemas or {}
						vim.list_extend(new_config.settings.json.schemas, require("schemastore").json.schemas())
					end,
					settings = { json = { validate = { enable = true } } },
				},
			},
		},
	},

	{
		"stevearc/conform.nvim",
		opts = {
			formatters_by_ft = {
				json = { "prettier" },
				jsonc = { "prettier" },
				json5 = { "prettier" },
			},
		},
	},

	{
		"nvim-treesitter/nvim-treesitter",
		opts = { ensure_installed = { "json5" } },
	},
}
