vim.lsp.enable("rust_analyzer")

---@type LangSpec
return {
	treesitters = {
		"rust",
		"ron",
	},
}
