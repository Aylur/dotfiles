vim.api.nvim_create_autocmd("TextYankPost", {
	group = vim.api.nvim_create_augroup("my.highlight-on-yank", { clear = true }),
	desc = "Highlight on Yank",
	callback = function()
		vim.hl.on_yank()
	end,
})

vim.api.nvim_create_autocmd("TextYankPost", {
	group = vim.api.nvim_create_augroup("my.copy-on-yank", { clear = true }),
	desc = "Copy text to clipboard",
	callback = function()
		if vim.v.event.operator == "y" then
			local text = vim.fn.getreg('"')
			local regtype = vim.fn.getregtype('"')
			vim.fn.setreg("+", text, regtype)
			vim.fn.setreg("*", text, regtype)
		end
	end,
})

vim.api.nvim_create_autocmd("LspAttach", {
	group = vim.api.nvim_create_augroup("my.hover-lsp-attach", { clear = true }),
	callback = function(event)
		local client = vim.lsp.get_client_by_id(event.data.client_id)
		local docHighlight = vim.lsp.protocol.Methods.textDocument_documentHighlight

		if client and client:supports_method(docHighlight, event.buf) then
			local group_name = "my.lsp-highlight"
			local group = vim.api.nvim_create_augroup(group_name, { clear = false })

			vim.api.nvim_create_autocmd({ "CursorHold", "CursorHoldI" }, {
				buffer = event.buf,
				group = group,
				callback = vim.lsp.buf.document_highlight,
			})

			vim.api.nvim_create_autocmd({ "CursorMoved", "CursorMovedI" }, {
				buffer = event.buf,
				group = group,
				callback = vim.lsp.buf.clear_references,
			})

			vim.api.nvim_create_autocmd("LspDetach", {
				group = vim.api.nvim_create_augroup("my.hover-lsp-detach", { clear = true }),
				callback = function(event2)
					vim.lsp.buf.clear_references()
					vim.api.nvim_clear_autocmds({ group = group_name, buffer = event2.buf })
				end,
			})
		end
	end,
})

vim.api.nvim_create_autocmd("BufWritePre", {
	desc = "Format on save",
	group = vim.api.nvim_create_augroup("my.format-on-save", { clear = true }),
	callback = function(args)
		local is_valid = vim.api.nvim_buf_is_valid(args.buf)
		local is_normal = vim.bo[args.buf].buftype == ""

		if vim.g.format_on_save and is_valid and is_normal then
			require("conform").format({
				buf = args.buf,
				timeout_ms = 2000,
				lsp_format = "fallback",
			})
		end
	end,
})
