return {
	{
		"folke/snacks.nvim",
		lazy = false,
		opts = {
			styles = {
				terminal = { border = "rounded" },
			},
			picker = { enabled = true },
			explorer = { enabled = true },
			lazygit = { configure = true },
		},
		keys = {
            -- stylua: ignore start
			{ "<leader>pp", function() Snacks.picker() end, desc = "Open Picker" },
			{ "<leader>e", function() Snacks.explorer({ layout = "select", auto_close = true }) end, desc = "File Explorer" },
			{ "<leader><space>", function() Snacks.picker.smart({ layout = "select" }) end, desc = "Find Files", },
			{ "<leader>ff", function() Snacks.picker.smart() end, desc = "Find Files", },
            { "<leader>fg", function() Snacks.picker.grep() end, desc = "Grep" },
            { "<leader>ft", function() Snacks.terminal(vim.env.SHELL) end, desc = "Open Terminal" },
            { "<leader>gg", function() Snacks.lazygit() end, desc = "Git Status" },
			-- stylua: ignore end
		},
	},
}
