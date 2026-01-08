vim.lsp.config("lua_ls", {
	settings = {
		Lua = {
			workspace = {
				library = vim.list_extend(vim.api.nvim_get_runtime_file("", true), {
					vim.env.VIMRUNTIME,
					vim.fn.stdpath("config") .. "/lua",
				}),
			},
		},
	},
})

vim.lsp.enable("lua_ls")

---@type LangSpec
return {
	ft = {
		name = "lua",
		pattern = "lua",
		locals = {
			shiftwidth = 4,
			tabstop = 4,
		},
	},
	formatters = {
		lua = {
			"stylua",
		},
	},
	treesitters = {
		"lua",
	},
	icons = {
		["nvim-pack-lock.json"] = { glyph = "", hl = "MiniIconsGreen" },
	},
}
