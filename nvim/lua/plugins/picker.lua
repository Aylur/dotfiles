local function picker()
	Snacks.picker()
end

local function explorer()
	Snacks.picker.explorer({ auto_close = true })
end

local function file_select()
	Snacks.picker.smart({ layout = "select" })
end

local function file_picker()
	Snacks.picker.smart({ layout = "default" })
end

local function live_grep()
	Snacks.picker.grep({ layout = "dropdown" })
end

local function terminal()
	Snacks.terminal(vim.env.SHELL)
end

local function lazygit()
	Snacks.lazygit()
end

return {
	{
		"folke/snacks.nvim",
		lazy = false,
		opts = {
			styles = {
				terminal = { border = "rounded" },
				sidebar = { position = "right" },
			},
			lazygit = { configure = true },
			picker = { enabled = true },
		},
		keys = {
			{ "<leader>pp", picker, desc = "Open Picker" },
			{ "<leader>e", explorer, desc = "File Explorer" },
			{ "<leader><space>", file_select, desc = "Find Files" },
			{ "<leader>ff", file_picker, desc = "Find Files" },
			{ "<leader>fg", live_grep, desc = "Grep" },
			{ "<leader>ft", terminal, desc = "Open Terminal" },
			{ "<leader>gg", lazygit, desc = "Git Status" },
		},
	},
}
