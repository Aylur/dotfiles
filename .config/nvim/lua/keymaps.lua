-- quick save
vim.keymap.set('n', '<leader>s', function() vim.cmd('w') end, { desc = 'Quick Save' })
vim.keymap.set({'i', 'n'}, '<C-s>', function() vim.cmd('w') end, { desc = 'Quick Save' })

-- toggles
vim.keymap.set('n', '<leader>w', function() vim.cmd('set wrap!') end, { desc = 'Toggle [w]rap' })
vim.keymap.set('n', '<leader>ln', function() vim.cmd('set rnu!') end, { desc = '[Line] [N]umbers'})
vim.keymap.set('n', '<leader>lc', function() vim.cmd('set colorcolumn=80') end, { desc = '[C]olor [C]olorcolumn'})

-- nvimtree
vim.keymap.set('n', '<leader>e', vim.cmd.NvimTreeFocus, { desc = 'Focus NvimTree' })

-- Telescope
vim.keymap.set('n', '<leader>fg', require('telescope.builtin').live_grep, { desc = '[F]ind in file using Telescope'})
vim.keymap.set({'i', 'n',}, '<C-f>', function() require('telescope.builtin').current_buffer_fuzzy_find({ sorting_strategy = 'ascending' }) end, { desc = '[F]ind in file using Telescope'})
vim.keymap.set('n', 'f', function() require('telescope.builtin').find_files(require('telescope.themes').get_dropdown({previewer = false})) end, { desc = 'Telescope [f]ind file' })
vim.keymap.set('n', '<leader>ff', require('telescope.builtin').find_files, { desc = 'Telescope [f]ind file' })
vim.keymap.set('n', '<leader>gc', require('telescope.builtin').git_commits, { desc = '[G]it [C]ommits' })
vim.keymap.set('n', '<leader>gb', require('telescope.builtin').git_branches, { desc = '[G]it [B]ranches' })
vim.keymap.set('n', '<leader>gs', require('telescope.builtin').git_status, { desc = '[G]it [S]tatus' })
vim.keymap.set('n', '<leader>gS', require('telescope.builtin').git_stash, { desc = '[G]it [S]tash' })

-- move selected lines
vim.keymap.set('v', 'J', ":m '>+1<CR>gv=gv")
vim.keymap.set('v', 'K', ":m '<-2<CR>gv=gv")

-- search terms keep in middle
vim.keymap.set('n', 'n', 'nzzzv')
vim.keymap.set('n', 'N', 'Nzzzv')

-- keep buffer after pasting on selected text
vim.keymap.set('x', 'p', [['_dP]])

-- folke/Trouble
vim.keymap.set('n', '<leader>xx', vim.cmd.TroubleToggle, { desc = 'TroubleToggle' })
vim.keymap.set('n', '<leader>xw', '<cmd>TroubleToggle workspace_diagnostics<cr>', { desc = 'TroubleToggle [W]orkspace'})

-- buffers
vim.keymap.set({'n', 'i', 'v'}, '<A-l>', vim.cmd.bnext, { desc = 'Switch to next Buffer' })
vim.keymap.set({'n', 'i', 'v'}, '<A-h>', vim.cmd.bprev, { desc = 'Switch to prev Buffer' })
vim.keymap.set('n', 'q', function () vim.cmd('w'); vim.cmd('bw'); vim.cmd('bprev') end, { desc = 'Close Buffer' })

-- selection
vim.keymap.set('n', '<C-a>', 'ggVG')
vim.keymap.set('n', '<C-l>', 'V')
vim.keymap.set('v', '<C-l>', 'j')
vim.keymap.set('v', 'V', 'j')

-- colors
vim.keymap.set('n', '<leader>c', vim.cmd.ColorizerToggle, { desc = '[C]olorizer'})
vim.keymap.set('n', '<leader>p', vim.cmd.PickColor, { desc = '[P]ick Color'})
