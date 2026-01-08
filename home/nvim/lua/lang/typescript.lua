vim.lsp.config("vtsls", {
	settings = {
		complete_function_calls = true,
		vtsls = {
			enableMoveToFileCodeAction = true,
			autoUseWorkspaceTsdk = true,
			experimental = {
				maxInlayHintLength = 30,
				completion = {
					enableServerSideFuzzyMatch = true,
				},
			},
		},
		typescript = {
			updateImportsOnFileMove = { enabled = "always" },
			suggest = { completeFunctionCalls = true },
		},
	},
})

vim.lsp.config("tailwindcss", {
	settings = {
		tailwindCSS = {
			classFunctions = { "clsx" },
		},
	},
})

vim.lsp.enable({ "vtsls", "eslint", "tailwindcss", "cssls" })

---@type LangSpec
return {
	ft = {
		name = "typescript",
		pattern = {
			"css",
			"typescript.jsx",
			"javascript.jsx",
			"typescript",
			"javacript",
			"typescriptreact",
			"javacriptreact",
		},
		locals = {
			shiftwidth = 2,
			tabstop = 2,
		},
	},
	treesitters = {
		"css",
		"scss",
		"html",
		"javascript",
		"jsdoc",
		"json",
		"tsx",
		"jsx",
		"typescript",
		"typescript",
		"javascript",
		"jsdoc",
	},
	formatters = {
		javascript = { "prettier" },
		typescript = { "prettier" },
		typescriptreact = { "prettier" },
		javascriptreact = { "prettier" },
		["typescript.jsx"] = { "prettier" },
		["javascript.jsx"] = { "prettier" },
		css = { "prettier" },
		scss = { "prettier" },
		json = { "prettier" },
		jsonc = { "prettier" },
		json5 = { "prettier" },
		graphql = { "prettier" },
		yaml = { "prettier" },
	},
	icons = {
		["vercel.json"] = { glyph = "", hl = "MiniIconsGray" },
		["package.json"] = { glyph = "", hl = "MiniIconsGreen" },
		[".node-version"] = { glyph = "", hl = "MiniIconsGreen" },
		[".prettierrc"] = { glyph = "", hl = "MiniIconsPurple" },
		["prettier.config.js"] = { glyph = "", hl = "MiniIconsPurple" },
		["prettier.config.ts"] = { glyph = "", hl = "MiniIconsPurple" },
		[".eslintrc.js"] = { glyph = "󰱺", hl = "MiniIconsYellow" },
		["eslint.config.js"] = { glyph = "󰱺", hl = "MiniIconsYellow" },
		["eslint.config.ts"] = { glyph = "󰱺", hl = "MiniIconsAzure" },
		["tsconfig.json"] = { glyph = "", hl = "MiniIconsBlue" },
		[".yarnrc.yml"] = { glyph = "", hl = "MiniIconsBlue" },
		["yarn.lock"] = { glyph = "", hl = "MiniIconsBlue" },
		["pnpm-lock.yaml"] = { glyph = "", hl = "MiniIconsYellow" },
		["pnpm-workspace.yaml"] = { glyph = "", hl = "MiniIconsYellow" },
		["docker-compose.yaml"] = { glyph = "", hl = "MiniIconsBlue" },
	},
}
