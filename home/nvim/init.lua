require("config.colorscheme")

-- TODO: add
-- - mason (for non nix systems)

vim.pack.add({
	{ src = "https://github.com/L3MON4D3/LuaSnip" },
	{ src = "https://github.com/neovim/nvim-lspconfig" },
	{ src = "https://github.com/stevearc/conform.nvim" },
	{ src = "https://github.com/nvim-treesitter/nvim-treesitter" },
	{ src = "https://github.com/saghen/blink.cmp", version = "v1.8.0" },
	{ src = "https://github.com/akinsho/bufferline.nvim", version = "v4.9.1" },
	{ src = "https://github.com/nvim-lualine/lualine.nvim" },
	{ src = "https://github.com/nvim-tree/nvim-web-devicons" },
	{ src = "https://github.com/nvim-mini/mini.icons" },
	{ src = "https://github.com/folke/ts-comments.nvim" },
	{ src = "https://github.com/nvim-mini/mini.pairs" },
	{ src = "https://github.com/folke/which-key.nvim" },
	{ src = "https://github.com/folke/todo-comments.nvim" },
	{ src = "https://github.com/nvim-lua/plenary.nvim" },
	{ src = "https://github.com/christoomey/vim-tmux-navigator" },
	{ src = "https://github.com/folke/snacks.nvim" },
	{ src = "https://github.com/MunifTanjim/nui.nvim" },
	{ src = "https://github.com/folke/noice.nvim" },
	{ src = "https://github.com/lewis6991/gitsigns.nvim" },
	{ src = "https://github.com/windwp/nvim-ts-autotag.git" },
	{ src = "https://github.com/b0o/SchemaStore.nvim.git" },
})

-- config
require("config.options")
require("config.keymaps")
require("config.autocmds")

-- plugins
require("plugins.lualine")
require("plugins.misc")
require("plugins.treesitter")
require("plugins.todolist")

-- lang setups
require("plugins.language").setup({
	require("lang.go"),
	require("lang.json"),
	require("lang.lua"),
	require("lang.markdown"),
	require("lang.nix"),
	require("lang.nu"),
	require("lang.python"),
	require("lang.rust"),
	require("lang.typescript"),
	require("lang.vala"),
})
