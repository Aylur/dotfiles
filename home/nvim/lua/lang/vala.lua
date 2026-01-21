vim.lsp.enable({ "vala_ls", "mesonlsp", "blueprint_ls" })

---@type LangSpec
return {
	ft = {
		name = "vala",
		pattern = "vala",
		locals = {
			shiftwidth = 4,
			tabstop = 4,
		},
	},
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
