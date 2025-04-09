return {
	{ "ibhagwan/fzf-lua", enabled = false },
	{ "folke/persistence.nvim", enable = false },

	{
		"nvim-lspconfig",
		opts = { inlay_hints = { enabled = false } },
	},
	{
		"folke/snacks.nvim",
		opts = { scroll = { enabled = false } },
	},
	{
		"ziontee113/color-picker.nvim",
		opts = {},
		keys = {
			{ "<leader>ct", vim.cmd.ColorizerToggle, desc = "[C]olorizer" },
			{ "<leader>cp", vim.cmd.PickColor, desc = "[P]ick Color" },
		},
	},
	{ "norcalli/nvim-colorizer.lua" },
	{ "christoomey/vim-tmux-navigator" },
	{
		"lewis6991/gitsigns.nvim",
		opts = {
			current_line_blame = true,
			current_line_blame_opts = {
				delay = 300,
			},
		},
	},
}
