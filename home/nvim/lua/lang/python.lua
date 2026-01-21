vim.lsp.enable("ruff")
vim.lsp.enable("ruff_lsp")
vim.lsp.enable("pyright")

---@type LangSpec
return {
	treesitters = {
		"ninja",
		"rst",
	},
	comments = {
		jinja = "{#- %s -#}",
	},
}
