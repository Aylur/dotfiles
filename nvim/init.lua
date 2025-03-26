vim.g.lazyvim_json = vim.fn.stdpath("data") .. "/lazyvim.json"

local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
	vim.fn.system({
		"git",
		"clone",
		"--filter=blob:none",
		"https://github.com/folke/lazy.nvim.git",
		"--branch=stable",
		lazypath,
	})
end
vim.opt.rtp:prepend(vim.env.LAZY or lazypath)

vim.g.mapleader = " "
vim.g.maplocalleader = "\\"

require("lazy").setup({
	lockfile = vim.fn.stdpath("data") .. "/lazy-lock.json",
	checker = {
		enabled = true,
		notify = false,
	},
	spec = {
		{ import = "plugins" },
		{ import = "lang" },
		{ "christoomey/vim-tmux-navigator" },
	},
	change_detection = {
		enabled = false,
	},
})

require("options")
require("keymaps")
require("autocmds")
