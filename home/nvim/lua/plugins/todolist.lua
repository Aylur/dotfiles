local function open_todolist()
	local filepath = vim.g.todo_file or "~/todo.md"
	local path = vim.fn.fnamemodify(filepath, ":p")
	local buf = vim.api.nvim_create_buf(false, false)

	if vim.fn.filereadable(path) ~= 1 then
		vim.fn.mkdir(vim.fn.fnamemodify(path, ":h"), "p")
		vim.fn.writefile({}, path)
	end

	local ui = vim.api.nvim_list_uis()[1]
	local width = math.floor(ui.width * 0.8)
	local height = math.floor(ui.height * 0.8)
	local col = math.floor((ui.width - width) / 2)
	local row = math.floor((ui.height - height) / 2)

	local win = vim.api.nvim_open_win(buf, true, {
		relative = "editor",
		width = width,
		height = height,
		col = col,
		row = row,
	})

	vim.api.nvim_set_current_win(win)
	vim.cmd("edit " .. path)

	vim.bo[buf].bufhidden = "wipe"
	vim.bo[buf].buflisted = false
	vim.wo[win].wrap = true
	vim.wo[win].number = false
	vim.wo[win].relativenumber = false
	vim.wo[win].signcolumn = "no"
end

vim.api.nvim_create_user_command("Todolist", open_todolist, {})
