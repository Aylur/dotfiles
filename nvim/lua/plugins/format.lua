return {
	{
		"folke/ts-comments.nvim",
		event = "VeryLazy",
		opts = {},
	},
	{
		"stevearc/conform.nvim",
		event = { "BufWritePre" },
		cmd = { "ConformInfo" },
		opts = {
			notify_on_error = false,
			format_on_save = function()
				if vim.g.autoformat then
					return {
						timeout_ms = 1500,
						async = false,
						lsp_format = "fallback",
					}
				end
			end,
			formatters_by_ft = {
				lua = { "stylua" },
				xml = { "xmllint" },
			},
		},
		init = function()
			vim.g.autoformat = true
		end,
	},
}
