return {
	{
		"nvim-lualine/lualine.nvim",
		event = "VeryLazy",
		opts = function()
			local icons = LazyVim.config.icons
			local noice = require("noice")
			local color = Snacks.util.color

			local mode = {
				"mode",
				padding = { left = 0, right = 1 },
			}

			local branch = {
				"branch",
				color = { fg = color("Keyword") },
			}

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
				color = { fg = color("Title") },
			}

			local command = {
				function()
					return noice.api.status.command.get()
				end,
				cond = function()
					return noice.api.status.command.has()
				end,
			}

			local macro = {
				function()
					return noice.api.status.mode.get()
				end,
				cond = function()
					return noice.api.status.mode.has()
				end,
				color = function()
					return { fg = color("Constant") }
				end,
			}

			return {
				options = {
					component_separators = { left = "", right = "" },
					section_separators = { left = "", right = "" },
					globalstatus = true,
					theme = {
						normal = {
							a = { fg = color("Normal", "fg") },
							b = { fg = color("Normal", "fg") },
							c = { fg = color("Normal", "fg") },
						},
						insert = { a = { fg = color("GitSignsAdd") } },
						visual = { a = { fg = color("Visual", "bg") } },
						replace = { a = { fg = color("GitSignsChange") } },
						command = { a = { fg = color("Title") } },
						terminal = { a = { fg = color("Keyword") } },
					},
				},
				sections = {
					lualine_a = { mode },
					lualine_b = { branch, LazyVim.lualine.pretty_path() },
					lualine_c = { diff },
					lualine_x = {
						diagnostic,
						macro,
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
