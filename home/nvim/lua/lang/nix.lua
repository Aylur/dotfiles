vim.lsp.enable("nil_ls")

---@type LangSpec
return {
	treesitters = {
		"nix",
	},
	formatters = {
		nix = { "alejandra" },
	},
}
