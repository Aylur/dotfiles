vim.g.mapleader = " "
vim.g.maplocalleader = " "
vim.g.format_on_save = true

vim.opt.breakindent = true
vim.opt.completeopt = "menu,menuone,preview,noselect"
vim.opt.confirm = true
vim.opt.cursorline = true
vim.opt.cursorlineopt = "number"
vim.opt.expandtab = true
vim.opt.exrc = true -- source .nvim.
vim.opt.hlsearch = false
vim.opt.inccommand = "split"
vim.opt.incsearch = true
vim.opt.linebreak = true
vim.opt.list = true -- show invisible characters
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.scrolloff = 8
vim.opt.signcolumn = "yes"
vim.opt.smartindent = true
vim.opt.softtabstop = 4
vim.opt.swapfile = false
vim.opt.tabstop = 4
vim.opt.termguicolors = true
vim.opt.undofile = true
vim.opt.undolevels = 10000
vim.opt.updatetime = 200
vim.opt.virtualedit = "block"
vim.opt.winborder = "single"
vim.opt.wrap = true

vim.diagnostic.config({
	severity_sort = true,
	underline = { severity = vim.diagnostic.severity.ERROR },
	signs = {
		text = {
			[vim.diagnostic.severity.ERROR] = "󰅚 ",
			[vim.diagnostic.severity.WARN] = "󰀪 ",
			[vim.diagnostic.severity.INFO] = "󰋽 ",
			[vim.diagnostic.severity.HINT] = "󰌶 ",
		},
	},
	virtual_text = {
		spacing = 4,
		source = "if_many",
		prefix = "●",
	},
})
