local color = require("snacks").util.color

local mode = {
	"mode",
	padding = { left = 0, right = 1 },
}

local branch = {
	"branch",
	color = { fg = color("Keyword") },
}

local filename = {
	"filename",
	path = 1,
	symbols = {
		modified = " ",
		readonly = " ",
		unnamed = "",
		newfile = "[New]",
	},
}

local diff = {
	"diff",
	symbols = {
		added = " ",
		modified = " ",
		removed = " ",
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
		error = " ",
		warn = " ",
		info = " ",
		hint = " ",
	},
}

local location = {
	"location",
	color = { fg = color("Title") },
}

local macro = {
	function()
		local reg = vim.fn.reg_recording()
		return reg ~= "" and "@" .. reg or ""
	end,
	color = function()
		return { fg = color("Constant") }
	end,
}

require("lualine").setup({
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
		lualine_b = { branch, filename },
		lualine_c = { diff },
		lualine_x = {
			diagnostic,
			"searchcount",
			"selectioncount",
		},
		lualine_y = { macro },
		lualine_z = { location },
	},
})
