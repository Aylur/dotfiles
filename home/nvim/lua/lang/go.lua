vim.lsp.enable("gopls")

---@type LangSpec
return {
	treesitters = {
		"go",
		"gomod",
		"gowork",
		"gosum",
	},
	icons = {
		[".go-version"] = { glyph = "", hl = "MiniIconsBlue" },
	},
	formatters = {
		go = { "goimports", "gofumpt" },
	},
}
