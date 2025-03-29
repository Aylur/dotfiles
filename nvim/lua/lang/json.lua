return {
	{
		"nvim-treesitter/nvim-treesitter",
		opts = { ensure_installed = { "json5" } },
	},
	{
		"stevearc/conform.nvim",
		opts = {
			formatters_by_ft = {
				json = { "prettierd", "prettier", stop_after_first = true },
			},
		},
	},
	{
		"b0o/SchemaStore.nvim",
		lazy = true,
		version = false,
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
					settings = {
						json = {
							validate = { enable = true },
						},
					},
				},
			},
		},
	},
}
