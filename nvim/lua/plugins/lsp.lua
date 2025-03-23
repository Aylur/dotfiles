local function on_attach(event)
	local map = function(keys, func, desc, mode)
		vim.keymap.set(mode or "n", keys, func, { buffer = event.buf, desc = "LSP: " .. desc })
	end

	map("gd", vim.lsp.buf.definition, "Goto Definition")
	map("gr", vim.lsp.buf.references, "References")
	map("gI", vim.lsp.buf.implementation, "Goto Implementation")
	map("gy", vim.lsp.buf.type_definition, "Goto T[y]pe Definition")
	map("gD", vim.lsp.buf.declaration, "Goto Declaration")
	map("K", vim.lsp.buf.hover, "Hover")
	map("<leader>cr", vim.lsp.buf.rename, "[R]e[n]ame")
	map("<leader>ca", vim.lsp.buf.code_action, "[C]ode [A]ction", { "n", "x" })
	map("gD", vim.lsp.buf.declaration, "[G]oto [D]eclaration")

	-- This function resolves a difference between neovim nightly (version 0.11) and stable (version 0.10)
	---@param client vim.lsp.Client
	---@param method vim.lsp.protocol.Method
	---@param bufnr? integer some lsp support methods only in specific files
	---@return boolean
	local function client_supports_method(client, method, bufnr)
		if vim.fn.has("nvim-0.11") == 1 then
			return client:supports_method(method, bufnr)
		else
			return client.supports_method(method, { bufnr = bufnr })
		end
	end

	-- The following two autocommands are used to highlight references of the
	-- word under your cursor when your cursor rests there for a little while.
	--    See `:help CursorHold` for information about when this is executed
	--
	-- When you move your cursor, the highlights will be cleared (the second autocommand).
	local client = vim.lsp.get_client_by_id(event.data.client_id)
	if
		client and client_supports_method(client, vim.lsp.protocol.Methods.textDocument_documentHighlight, event.buf)
	then
		local highlight_augroup = vim.api.nvim_create_augroup("lsp-highlight", { clear = false })

		vim.api.nvim_create_autocmd({ "CursorHold", "CursorHoldI" }, {
			buffer = event.buf,
			group = highlight_augroup,
			callback = vim.lsp.buf.document_highlight,
		})

		vim.api.nvim_create_autocmd({ "CursorMoved", "CursorMovedI" }, {
			buffer = event.buf,
			group = highlight_augroup,
			callback = vim.lsp.buf.clear_references,
		})

		vim.api.nvim_create_autocmd("LspDetach", {
			group = vim.api.nvim_create_augroup("lsp-detach", { clear = true }),
			callback = function(event2)
				vim.lsp.buf.clear_references()
				vim.api.nvim_clear_autocmds({ group = "lsp-highlight", buffer = event2.buf })
			end,
		})
	end
end

return {
	{
		"neovim/nvim-lspconfig",
		dependencies = {
			"saghen/blink.cmp",
			{ "j-hui/fidget.nvim", opts = {} },
			{ "folke/lazydev.nvim", ft = "lua", opts = {} },
		},
		opts = {
			servers = { lua_ls = {} },
		},
		config = function(_, opts)
			for server, config in pairs(opts.servers) do
				config.capabilities = require("blink.cmp").get_lsp_capabilities(config.capabilities)
				require("lspconfig")[server].setup(config)
			end

			vim.api.nvim_create_autocmd("LspAttach", {
				group = vim.api.nvim_create_augroup("lsp-attach", { clear = true }),
				callback = on_attach,
			})
		end,
	},
}
