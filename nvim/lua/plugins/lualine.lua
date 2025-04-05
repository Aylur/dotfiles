return {
	{
		"nvim-lualine/lualine.nvim",
		event = "VeryLazy",
		opts = function()
			local icons = LazyVim.config.icons
			local noice = require("noice")

			local diff = {
				"diff",
				symbols = {
					added = icons.git.added,
					modified = icons.git.modified,
					removed = icons.git.removed,
				},
				source = function()
					local gitsigns = vim.b.gitsigns_status_dict
					if gitsigns then
						return {
							added = gitsigns.added,
							modified = gitsigns.changed,
							removed = gitsigns.removed,
						}
					end
				end,
			}

			local diagnostic = {
				"diagnostics",
				symbols = {
					error = icons.diagnostics.Error,
					warn = icons.diagnostics.Warn,
					info = icons.diagnostics.Info,
					hint = icons.diagnostics.Hint,
				},
			}

			local location = {
				"location",
				padding = { left = 1, right = 1 },
			}

			local command = {
				function()
					return noice.api.status.command.get()
				end,
				cond = function()
					return noice.api.status.command.has()
				end,
			}

			local mode = {
				function()
					return noice.api.status.mode.get()
				end,
				cond = function()
					return noice.api.status.mode.has()
				end,
				color = function()
					return { fg = Snacks.util.color("Constant") }
				end,
			}

			return {
				options = {
					-- component_separators = { left = "╲", right = "│" },
					-- section_separators = { left = "", right = "" },
					component_separators = { left = "│", right = "│" },
					section_separators = { left = "", right = "" },
					theme = "auto",
					globalstatus = true,
				},
				sections = {
					lualine_a = { "mode" },
					lualine_b = { "branch" },
					lualine_c = {
						{ LazyVim.lualine.pretty_path() },
						diff,
					},
					lualine_x = {
						diagnostic,
						mode,
						"searchcount",
						"selectioncount",
					},
					lualine_y = { command },
					lualine_z = { location },
				},
			}
		end,
	},
}
