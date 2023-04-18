vim.g.mapleader = ' '
vim.g.maplocalleader = ' '
vim.opt.termguicolors = true

require('plugins')
require('settings')
require('keymaps')

vim.cmd.colorscheme('catppuccin-mocha') -- charm
