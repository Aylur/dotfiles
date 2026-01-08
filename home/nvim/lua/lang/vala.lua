vim.lsp.enable({ "vala_ls", "mesonlsp", "blueprint_ls" })

---@type LangSpec
return {
	comments = {
		vala = "// %s",
		meson = "# %s",
		blueprint = "// %s",
	},
	treesitters = {
		"vala",
		"meson",
	},
}
