local map = vim.keymap.set

map("n", "Q", "@q")

-- better up/down
map({ "n", "x" }, "j", "v:count == 0 ? 'gj' : 'j'", { desc = "Down", expr = true, silent = true })
map({ "n", "x" }, "<Down>", "v:count == 0 ? 'gj' : 'j'", { desc = "Down", expr = true, silent = true })
map({ "n", "x" }, "k", "v:count == 0 ? 'gk' : 'k'", { desc = "Up", expr = true, silent = true })
map({ "n", "x" }, "<Up>", "v:count == 0 ? 'gk' : 'k'", { desc = "Up", expr = true, silent = true })

-- move selected lines
map("v", "J", ":m '>+1<CR>gv=gv")
map("v", "K", ":m '<-2<CR>gv=gv")

-- better indenting
map("v", "<", "<gv")
map("v", ">", ">gv")

-- buffers
map({ "n", "i", "v" }, "<A-l>", vim.cmd.bnext, { desc = "Switch to next Buffer" })
map({ "n", "i", "v" }, "<A-h>", vim.cmd.bprev, { desc = "Switch to prev Buffer" })
map("n", "L", vim.cmd.bnext, { desc = "Switch to next Buffer" })
map("n", "H", vim.cmd.bprev, { desc = "Switch to prev Buffer" })
map("n", "<C-q>", function()
	vim.cmd("bw")
end, { desc = "Close Buffer" })

-- selection
map("n", "<C-a>", "ggVG")
map("v", "V", "j")

-- paste
map("n", "<leader>p", '"_dP')

-- tmux
map({ "n", "i", "v" }, "<C-h>", vim.cmd.TmuxNavigateLeft)
map({ "n", "i", "v" }, "<C-j>", vim.cmd.TmuxNavigateDown)
map({ "n", "i", "v" }, "<C-k>", vim.cmd.TmuxNavigateUp)
map({ "n", "i", "v" }, "<C-l>", vim.cmd.TmuxNavigateRight)

-- tranparency
map("n", "<leader>o", function()
	vim.cmd("highlight Normal guibg=NONE")
	vim.cmd("highlight NonText guibg=NONE")
	vim.cmd("highlight NonText ctermbg=NONE")
	vim.cmd("highlight NonText ctermbg=NONE")
end, { desc = "Toggle background opacity" })
