require("which-key").setup({ preset = "helix" })

require("nvim-ts-autotag").setup({})
require("todo-comments").setup({})

require("snacks").setup({
	picker = { enabled = true },
	explorer = { enabled = true },
	notifier = { enabled = true },
	styles = {
		terminal = { border = vim.o.winborder },
	},
	indent = {
		indent = {
			hl = "LineNr",
			char = "┊",
		},
		scope = {
			hl = "SnacksIndent",
		},
	},
})

require("mini.pairs").setup({})
require("mini.icons").mock_nvim_web_devicons()

require("noice").setup({
	lsp = {
		override = {
			["vim.lsp.util.convert_input_to_markdown_lines"] = true,
			["vim.lsp.util.stylize_markdown"] = true,
		},
	},
	views = {
		cmdline_popup = {
			position = {
				row = 10,
				col = "50%",
			},
			size = {
				width = 60,
				height = "auto",
			},
			border = {
				style = vim.o.winborder,
			},
		},
	},
})

require("bufferline").setup({
	options = {
		diagnostics = "nvim_lsp",
		always_show_bufferline = false,
	},
})

require("gitsigns").setup({
	signs = {
		add = { text = "▎" },
		change = { text = "▎" },
		delete = { text = "" },
		topdelete = { text = "" },
		changedelete = { text = "▎" },
		untracked = { text = "▎" },
	},
	signs_staged = {
		add = { text = "▎" },
		change = { text = "▎" },
		delete = { text = "" },
		topdelete = { text = "" },
		changedelete = { text = "▎" },
	},
	current_line_blame = true,
	current_line_blame_opts = {
		delay = 300,
	},
})

require("blink.cmp").setup({
	sources = {
		default = { "lsp", "path", "snippets", "buffer" },
	},
	completion = {
		menu = {
			border = "none",
			draw = { treesitter = { "lsp" } },
		},
		documentation = {
			auto_show = true,
			auto_show_delay_ms = 500,
		},
		accept = {
			auto_brackets = {
				enabled = true,
			},
		},
		ghost_text = {
			enabled = true,
			show_with_selection = true,
		},
	},
	keymap = {
		preset = "enter",
		["<C-y>"] = { "select_and_accept" },
	},
})
