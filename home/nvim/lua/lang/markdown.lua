vim.lsp.enable({ "marksman" })

require("conform").formatters.prettier = {
	prepend_args = { "--prose-wrap", "always" },
}

---@type LangSpec
return {
	ft = {
		name = "markdown",
		pattern = {
			"md",
			"markdown",
		},
		locals = {
			shiftwidth = 2,
			tabstop = 2,
		},
	},
	formatters = {
		markdown = { "prettier" },
		["markdown.mdx"] = { "prettier" },
	},
}
