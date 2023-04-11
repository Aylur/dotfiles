-- tabs
vim.keymap.set('n', '<leader>tn',  function() vim.cmd('tab split') end, { desc = '[T]ab [N]ew'})
vim.keymap.set('n', '<leader>tc',  function() vim.cmd('tabclose')  end, { desc = '[T]ab [C]lose'})
vim.keymap.set('n', '<leader>tsn', function() vim.cmd('tabn') end,  { desc = '[T]ab [S]witch to [N]ext'})
vim.keymap.set('n', '<leader>tsp', function() vim.cmd('tabp') end, { desc = '[T]ab [S]witch to [P]revious'})

-- theme
vim.keymap.set('n', '<leader>tvl', function() require('vscode').change_style('light') end, { desc = '[T]heme [V]sCode [L]ight'})
vim.keymap.set('n', '<leader>tvd', function() require('vscode').change_style('light') end, { desc = '[T]heme [V]sCode [D]ark'})

-- quick save
vim.keymap.set('n', '<leader>s', function() vim.cmd('w') end, { desc = 'Quick Save' })
vim.keymap.set('i', '<C-s>', function() vim.cmd('w') end, { desc = 'Quick Save' })

-- toggle wrap
vim.keymap.set('n', '<leader>w', function() vim.cmd('set wrap!') end, { desc = 'Toggle [w]rap' })

-- netrw
-- vim.keymap.set('n', '<leader>e', vim.cmd.Ex, { desc = 'netrw' })

-- nvimtree
vim.keymap.set('n', '<leader>e', vim.cmd.NvimTreeFocus, { desc = 'Focus NvimTree' })
vim.keymap.set('n', '<leader>c', vim.cmd.NvimTreeClose, { desc = '[C]lose NvimTree'})

-- Telescope
vim.keymap.set('n', '<leader>ff', require('telescope.builtin').find_files, { desc = 'Telescope [f]ind [f]ile' })
vim.keymap.set('n', '<leader>fg', require('telescope.builtin').live_grep,  { desc = 'Telescope [f]ind live [g]rep' })
vim.keymap.set('n', '<leader>fb', require('telescope.builtin').buffers,    { desc = 'Telescope [f]ind [b]uffers' })
vim.keymap.set('n', '<leader>fh', require('telescope.builtin').help_tags,  { desc = 'Telescope [f]ind [h]elp' })

-- move selected lines
vim.keymap.set("v", "J", ":m '>+1<CR>gv=gv")
vim.keymap.set("v", "K", ":m '<-2<CR>gv=gv")

-- search terms keep in middle
vim.keymap.set("n", "n", "nzzzv")
vim.keymap.set("n", "N", "Nzzzv")

-- keep buffer after pasting on selected text
vim.keymap.set("x", "<leader>p", [["_dP]])

-- folke/Trouble
vim.keymap.set("n", "<leader>xx", "<cmd>TroubleToggle<cr>", {silent = true, noremap = true} )
vim.keymap.set("n", "<leader>xw", "<cmd>TroubleToggle workspace_diagnostics<cr>", {silent = true, noremap = true} )
vim.keymap.set("n", "<leader>xd", "<cmd>TroubleToggle document_diagnostics<cr>", {silent = true, noremap = true} )
vim.keymap.set("n", "<leader>xl", "<cmd>TroubleToggle loclist<cr>", {silent = true, noremap = true} )
vim.keymap.set("n", "<leader>xq", "<cmd>TroubleToggle quickfix<cr>", {silent = true, noremap = true} )
vim.keymap.set("n", "gR", "<cmd>TroubleToggle lsp_references<cr>", {silent = true, noremap = true} )
