local opt = vim.opt

opt.wrap = true
opt.conceallevel = 1
opt.cursorline = false
opt.number = true -- Print line number
opt.relativenumber = true -- Relative line numbers
opt.hlsearch = false -- highlight search
opt.incsearch = true -- incremental search
opt.scrolloff = 4 -- scroll offset
opt.clipboard = "unnamedplus" -- sync clipboard with os
opt.breakindent = true
opt.inccommand = "split"

opt.tabstop = 4
opt.softtabstop = 4
opt.shiftwidth = 4
opt.expandtab = true

opt.swapfile = false

opt.cinoptions:append(":0") -- switch statement indentations
