-- quick save
vim.keymap.set('n', '<leader>s', function() vim.cmd('w') end, { desc = 'Quick Save' })
vim.keymap.set('i', '<C-s>', function() vim.cmd('w') end, { desc = 'Quick Save' })

-- toggle wrap
vim.keymap.set('n', '<leader>w', function() vim.cmd('set wrap!') end, { desc = 'Toggle [w]rap' })

-- netrw
vim.keymap.set('n', '<leader>ee', vim.cmd.Ex, { desc = 'netrw' })

-- Telescope
vim.keymap.set('n', 'ff', require('telescope.builtin').find_files, { desc = 'Telescope [f]ind [f]ile' })
vim.keymap.set('n', 'fg', require('telescope.builtin').live_grep,  { desc = 'Telescope [f]ind live [g]rep' })
vim.keymap.set('n', 'fb', require('telescope.builtin').buffers,    { desc = 'Telescope [f]ind [b]uffers' })
vim.keymap.set('n', 'fh', require('telescope.builtin').help_tags,  { desc = 'Telescope [f]ind [h]elp' })

-- move selected lines
vim.keymap.set("v", "J", ":m '>+1<CR>gv=gv")
vim.keymap.set("v", "K", ":m '<-2<CR>gv=gv")

-- search terms keep in middle
vim.keymap.set("n", "n", "nzzzv")
vim.keymap.set("n", "N", "Nzzzv")

-- keep buffer after pasting on selected text
vim.keymap.set("x", "<leader>p", [["_dP]])
