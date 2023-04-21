vim.g.mapleader = ' '
vim.g.maplocalleader = ' '
vim.opt.termguicolors = true

require('plugins')
require('settings')
require('keymaps')

local dark_mode = table.concat(vim.fn.systemlist(
    "gsettings get org.gnome.desktop.interface color-scheme"), '')

if dark_mode == 'prefer-dark' then
    vim.cmd.colorscheme('catppuccin-mocha')
else
    vim.cmd.colorscheme('rose-pine-dawn')
end
