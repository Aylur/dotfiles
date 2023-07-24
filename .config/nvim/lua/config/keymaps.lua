-- Telescope
vim.keymap.set("n", "<leader>fg", require("telescope.builtin").live_grep, { desc = "[F]ind in file using Telescope" })
vim.keymap.set("n", "f", function()
    require("telescope.builtin").find_files(require("telescope.themes").get_dropdown({ previewer = false }))
end, { desc = "Telescope [f]ind file" })

-- move selected lines
vim.keymap.set("v", "J", ":m '>+1<CR>gv=gv")
vim.keymap.set("v", "K", ":m '<-2<CR>gv=gv")

-- diagnostics
vim.keymap.set("n", "<leader>xx", vim.cmd.TroubleToggle, { desc = "TroubleToggle" })
vim.keymap.set(
    "n",
    "<leader>xw",
    "<cmd>TroubleToggle workspace_diagnostics<cr>",
    { desc = "TroubleToggle [W]orkspace" }
)

-- buffers
vim.keymap.set({ "n", "i", "v" }, "<A-l>", vim.cmd.bnext, { desc = "Switch to next Buffer" })
vim.keymap.set({ "n", "i", "v" }, "<A-h>", vim.cmd.bprev, { desc = "Switch to prev Buffer" })
vim.keymap.set("n", "q", function()
    vim.cmd("bw")
end, { desc = "Close Buffer" })

-- selection
vim.keymap.set("n", "<C-a>", "ggVG")
vim.keymap.set("v", "V", "j")

-- colors
vim.keymap.set("n", "<leader>c", vim.cmd.ColorizerToggle, { desc = "[C]olorizer" })
vim.keymap.set("n", "<leader>p", vim.cmd.PickColor, { desc = "[P]ick Color" })

-- generate docs
vim.keymap.set("n", "<leader>dg", vim.cmd.DogeGenerate, { desc = "Generate Docs" })
