local icons = {
	diff = {
		added = " ",
		modified = " ",
		removed = " ",
	},
	diagnostics = {
		error = " ",
		warn = " ",
		hint = " ",
		info = " ",
	},
}

return {
	"echasnovski/mini.icons",

	{
		"ziontee113/color-picker.nvim",
		opts = {},
		keys = {
			{ "<leader>ct", vim.cmd.ColorizerToggle, desc = "[C]olorizer" },
			{ "<leader>cp", vim.cmd.PickColor, desc = "[P]ick Color" },
		},
	},

	{
		"akinsho/bufferline.nvim",
		version = "*",
		dependencies = "nvim-tree/nvim-web-devicons",
		opts = {
			options = {
				diagnostics = "nvim_lsp",
				always_show_bufferline = false,
				diagnostics_indicator = function(_, _, diag)
					local i = icons.diagnostics
					local r = (diag.error and i.error .. diag.error .. " " or "")
						.. (diag.warning and i.warn .. diag.warning or "")
					return vim.trim(r)
				end,
			},
			highlights = require("catppuccin.groups.integrations.bufferline").get(),
		},
	},

	{
		"nvim-lualine/lualine.nvim",
		event = "VeryLazy",
		opts = function()
			local diff = {
				"diff",
				symbols = icons.diff,
			}

			local diagnostic = {
				"diagnostics",
				symbols = icons.diagnostics,
			}

			local filename = {
				"filename",
				symbols = {
					modified = " ",
					readonly = "[ro]",
					unnamed = "[unnamed]",
					newfile = "[new]",
				},
			}

			local position = {
				"location",
				padding = { left = 1, right = 1 },
			}

			return {
				options = {
					-- component_separators = { left = "╲", right = "│" },
					-- section_separators = { left = "", right = "" },
					component_separators = { left = "│", right = "│" },
					section_separators = { left = "", right = "" },
					theme = "auto",
					globalstatus = true,
					disabled_filetypes = { statusline = { "dashboard", "alpha" } },
				},
				sections = {
					lualine_a = { "mode" },
					lualine_b = { "branch", diff },
					lualine_c = { diagnostic },
					lualine_x = { "searchcount", "selectioncount", "encoding", "filetype" },
					lualine_y = { filename },
					lualine_z = { position },
				},
				extensions = { "neo-tree", "lazy" },
			}
		end,
	},

	{
		"folke/noice.nvim",
		event = "VeryLazy",
		opts = {},
		dependencies = { "MunifTanjim/nui.nvim" },
	},

	{
		"folke/snacks.nvim",
		lazy = false,
		opts = {
			dashboard = { enabled = true },
			indent = {
				enabled = true,
				indent = {
					hl = "LineNr",
					char = "┊",
				},
				scope = {
					hl = "SnacksIndent",
				},
			},
		},
	},
}
