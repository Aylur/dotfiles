require("lazy").setup({
	lockfile = vim.fn.stdpath("cache") .. "/lazy-lock.json",
	spec = {
		{ "LazyVim/LazyVim", import = "lazyvim.plugins" },
		{ import = "plugins" },
		{ import = "lang" },
		{ "LazyVim/LazyVim", opts = {
			colorscheme = "nucharm",
		} },
	},
	defaults = {
		version = false,
	},
	checker = {
		enabled = true,
		notify = false,
	},
	change_detection = {
		enabled = false,
	},
})
