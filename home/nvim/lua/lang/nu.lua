vim.lsp.enable("nushell")

---@type LangSpec
return {
	ft = {
		name = "nu",
		pattern = "nu",
		locals = {
			shiftwidth = 4,
			tabstop = 4,
		},
	},
	treesitters = { "nu" },
}
