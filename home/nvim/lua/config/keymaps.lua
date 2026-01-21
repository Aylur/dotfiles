-- local map = vim.keymap.set
local function map(mode, lhs, rhs, desc, opt)
	local opts = vim.tbl_extend("force", { desc = desc }, opt or {})
	vim.keymap.set(mode, lhs, rhs, opts)
end

map("n", "Q", "@q")

-- better up/down
map({ "n", "x" }, "j", "v:count == 0 ? 'gj' : 'j'", "Down", { expr = true, silent = true })
map({ "n", "x" }, "<Down>", "v:count == 0 ? 'gj' : 'j'", "Down", { expr = true, silent = true })
map({ "n", "x" }, "k", "v:count == 0 ? 'gk' : 'k'", "Up", { expr = true, silent = true })
map({ "n", "x" }, "<Up>", "v:count == 0 ? 'gk' : 'k'", "Up", { expr = true, silent = true })

-- move selected lines
map("v", "J", ":m '>+1<CR>gv=gv")
map("v", "K", ":m '<-2<CR>gv=gv")

-- better indenting
map("v", "<", "<gv")
map("v", ">", ">gv")

-- buffers
map({ "n", "i", "v" }, "<A-l>", vim.cmd.bnext, "Switch to next Buffer")
map({ "n", "i", "v" }, "<A-h>", vim.cmd.bprev, "Switch to prev Buffer")
map("n", "L", vim.cmd.bnext, "Switch to next Buffer")
map("n", "H", vim.cmd.bprev, "Switch to prev Buffer")
map("n", "<C-q>", vim.cmd.bwipe, "Close Buffer")

-- selection
map("n", "<C-a>", "ggVG")

-- save
map("", "<C-s>", vim.cmd.write)

-- tmux
map({ "n", "i", "v" }, "<C-h>", vim.cmd.TmuxNavigateLeft)
map({ "n", "i", "v" }, "<C-j>", vim.cmd.TmuxNavigateDown)
map({ "n", "i", "v" }, "<C-k>", vim.cmd.TmuxNavigateUp)
map({ "n", "i", "v" }, "<C-l>", vim.cmd.TmuxNavigateRight)

-- todo list
map("n", "<leader>T", vim.cmd.Todolist, "Open todolist")

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

local function lsp_symbols()
	require("snacks").picker.lsp_symbols()
end

local function diagnostics_buffer()
	require("snacks").picker.diagnostics_buffer()
end

map("n", "<leader>t", terminal, "Open Terminal")
map("n", "<leader>ft", terminal, "Open Terminal")
map("n", "<leader>pp", picker, "Open Picker")
map("n", "<leader>e", explorer, "File Explorer")
map("n", "<leader><space>", file_select, "Find Files")
map("n", "<leader>ff", file_picker, "Find Files")
map("n", "<leader>fg", live_grep, "Grep")
map("n", "<leader>gg", lazygit, "Git Status")
map("n", "<leader>fs", lsp_symbols, "LSP Symbols")
map("n", "<leader>fd", diagnostics_buffer, "Diagnostics")

-- toggles
local function toggle_format()
	vim.g.format_on_save = not vim.g.format_on_save
	local status = vim.g.format_on_save and "Enabled" or "Disabled"
	vim.notify(status .. " auto format on save")
end

local function toggle_diagnostics()
	local enabled = not vim.diagnostic.is_enabled()
	vim.diagnostic.enable(enabled)
	local status = enabled and "Enabled" or "Disabled"
	vim.notify(status .. " diagnostics")
end

local function toggle_minimal()
	vim.g.minimal = not vim.g.minimal
	vim.o.signcolumn = vim.g.minimal and "no" or "yes"
	vim.o.number = not vim.g.minimal
	vim.o.relativenumber = not vim.g.minimal
end

map("n", "<leader>uf", toggle_format, "Toggle Format on Save")
map("n", "<leader>ud", toggle_diagnostics, "Toggle Diagnostics")
map("n", "<leader>um", toggle_minimal, "Toggle Minimal")

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
		local bufmap = function(mode, keys, func, desc)
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

		bufmap("n", "<leader>cr", vim.lsp.buf.rename, "[C]ode Action [R]ename")
		bufmap("n", "<leader>co", action("source.organizeImports"), "[C]ode [O]rganize imports")
		bufmap({ "n", "x" }, "<leader>ca", vim.lsp.buf.code_action, "[C]ode [A]ction")
		bufmap({ "n", "x" }, "<leader>cd", vim.diagnostic.open_float, "[C]ode [D]iagnostics")

		bufmap("n", "grr", lsp_references, "[G]oto [R]eferences")
		bufmap("n", "gri", lsp_implementations, "[G]oto [I]mplementation")
		bufmap("n", "gd", lsp_definitions, "[G]oto [D]efinition")
		bufmap("n", "gD", lsp_declarations, "[G]oto [D]eclaration")
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

map("n", "<leader>ghS", stage_buffer, "Stage Buffer")
map("n", "<leader>ghR", reset_buffer, "Reset Buffer")
map("n", "<leader>ghb", blame_line, "Blame Line")
