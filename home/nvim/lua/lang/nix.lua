vim.lsp.enable("nil_ls")

---@type LangSpec
return {
	ft = {
		name = "nix",
		pattern = "nix",
		locals = {
			shiftwidth = 2,
			tabstop = 2,
		},
	},
	treesitters = {
		"nix",
	},
	formatters = {
		nix = { "alejandra" },
	},
}
