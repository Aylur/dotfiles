local keymap = vim.keymap.set

keymap("n", "Q", "@q")

-- better up/down
keymap({ "n", "x" }, "j", "v:count == 0 ? 'gj' : 'j'", { desc = "Down", expr = true, silent = true })
keymap({ "n", "x" }, "<Down>", "v:count == 0 ? 'gj' : 'j'", { desc = "Down", expr = true, silent = true })
keymap({ "n", "x" }, "k", "v:count == 0 ? 'gk' : 'k'", { desc = "Up", expr = true, silent = true })
keymap({ "n", "x" }, "<Up>", "v:count == 0 ? 'gk' : 'k'", { desc = "Up", expr = true, silent = true })

-- move selected lines
keymap("v", "J", ":m '>+1<CR>gv=gv")
keymap("v", "K", ":m '<-2<CR>gv=gv")

-- better indenting
keymap("v", "<", "<gv")
keymap("v", ">", ">gv")

-- buffers
keymap({ "n", "i", "v" }, "<A-l>", vim.cmd.bnext, { desc = "Switch to next Buffer" })
keymap({ "n", "i", "v" }, "<A-h>", vim.cmd.bprev, { desc = "Switch to prev Buffer" })
keymap("n", "L", vim.cmd.bnext, { desc = "Switch to next Buffer" })
keymap("n", "H", vim.cmd.bprev, { desc = "Switch to prev Buffer" })
keymap("n", "<C-q>", vim.cmd.bwipe, { desc = "Close Buffer" })

-- selection
keymap("n", "<C-a>", "ggVG")

-- save
keymap("", "<C-s>", vim.cmd.write)

-- tmux
keymap({ "n", "i", "v" }, "<C-h>", vim.cmd.TmuxNavigateLeft)
keymap({ "n", "i", "v" }, "<C-j>", vim.cmd.TmuxNavigateDown)
keymap({ "n", "i", "v" }, "<C-k>", vim.cmd.TmuxNavigateUp)
keymap({ "n", "i", "v" }, "<C-l>", vim.cmd.TmuxNavigateRight)

-- picker
local function terminal()
	require("snacks").terminal.toggle("nu")
end

local function picker()
	require("snacks").picker()
end

local function explorer()
	require("snacks").picker.explorer({ auto_close = true })
end

local function file_select()
	require("snacks").picker.smart({ layout = "select" })
end

local function file_picker()
	require("snacks").picker.smart({ layout = "default" })
end

local function live_grep()
	require("snacks").picker.grep({ layout = "dropdown" })
end

local function lazygit()
	require("snacks").lazygit()
end

keymap("n", "<leader>t", terminal, { desc = "Open Terminal" })
keymap("n", "<leader>ft", terminal, { desc = "Open Terminal" })
keymap("n", "<leader>pp", picker, { desc = "Open Picker" })
keymap("n", "<leader>e", explorer, { desc = "File Explorer" })
keymap("n", "<leader><space>", file_select, { desc = "Find Files" })
keymap("n", "<leader>ff", file_picker, { desc = "Find Files" })
keymap("n", "<leader>fg", live_grep, { desc = "Grep" })
keymap("n", "<leader>gg", lazygit, { desc = "Git Status" })

-- toggles
local function toggle_format()
	vim.g.format_on_save = not vim.g.format_on_save
end

keymap("n", "<leader>uf", toggle_format, { desc = "Toggle Format on Save" })

-- lsp
local function lsp_references()
	require("snacks").picker.lsp_references()
end

local function lsp_implementations()
	require("snacks").picker.lsp_implementations()
end

local function lsp_definitions()
	require("snacks").picker.lsp_definitions()
end

local function lsp_declarations()
	require("snacks").picker.lsp_declarations()
end

vim.api.nvim_create_autocmd("LspAttach", {
	group = vim.api.nvim_create_augroup("my.keymaps-lsp-attach", { clear = true }),
	callback = function(event)
		local map = function(mode, keys, func, desc)
			vim.keymap.set(mode, keys, func, { buffer = event.buf, desc = desc })
		end

		local function action(name)
			return function()
				vim.lsp.buf.code_action({
					apply = true,
					context = {
						only = { name },
						diagnostics = {},
					},
				})
			end
		end

		map("n", "<leader>cr", vim.lsp.buf.rename, "[C]ode Action [R]ename")
		map("n", "<leader>co", action("source.organizeImports"), "[C]ode [O]rganize imports")
		map({ "n", "x" }, "<leader>ca", vim.lsp.buf.code_action, "[C]ode [A]ction")

		map("n", "grr", lsp_references, "[G]oto [R]eferences")
		map("n", "gri", lsp_implementations, "[G]oto [I]mplementation")
		map("n", "gd", lsp_definitions, "[G]oto [D]efinition")
		map("n", "gD", lsp_declarations, "[G]oto [D]eclaration")
	end,
})

-- git
local function stage_buffer()
	require("gitsigns").stage_buffer()
end

local function reset_buffer()
	require("gitsigns").stage_buffer()
end

local function blame_line()
	require("gitsigns").blame_line({ full = true })
end

keymap("n", "<leader>ghS", stage_buffer, { desc = "Stage Buffer" })
keymap("n", "<leader>ghR", reset_buffer, { desc = "Reset Buffer" })
keymap("n", "<leader>ghb", blame_line, { desc = "Blame Line" })
