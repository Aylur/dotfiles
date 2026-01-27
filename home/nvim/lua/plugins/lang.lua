do -- treesitter
	require("nvim-treesitter").install({
		"go",
		"gomod",
		"gowork",
		"gosum",
		"json",
		"lua",
		"nix",
		"nu",
		"ninja",
		"rst",
		"rust",
		"ron",
		"astro",
		"styled", -- css
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
		"vala",
		"meson",
	})
end

do -- formatters
	require("conform").setup({
		formatters = {
			prettier = {
				prepend_args = { "--prose-wrap", "always" },
			},
		},
		formatters_by_ft = {
			go = { "goimports", "gofumpt" },
			json = { "prettier" },
			jsonc = { "prettier" },
			json5 = { "prettier" },
			yaml = { "prettier" },
			lua = { "stylua" },
			markdown = { "prettier" },
			["markdown.mdx"] = { "prettier" },
			xml = { "xmllint" },
			nix = { "alejandra" },
			javascript = { "prettier" },
			typescript = { "prettier" },
			typescriptreact = { "prettier" },
			javascriptreact = { "prettier" },
			["typescript.jsx"] = { "prettier" },
			["javascript.jsx"] = { "prettier" },
			css = { "prettier" },
			scss = { "prettier" },
			graphql = { "prettier" },
			astro = { "prettier" },
		},
	})
end

do -- lsp
	local specs = {
		gopls = {},
		jsonls = {
			json = {
				validate = { enable = true },
				schemas = require("schemastore").json.schemas({
					select = {
						"package.json",
						"tsconfig.json",
					},
				}),
			},
		},
		lua_ls = {
			Lua = {
				workspace = {
					library = vim.list_extend(vim.api.nvim_get_runtime_file("", true), {
						vim.env.VIMRUNTIME,
						vim.fn.stdpath("config") .. "/lua",
					}),
				},
			},
		},
		marksman = {},
		nil_ls = {},
		nushell = {},
		ruff = {},
		ruff_lsp = {},
		pyright = {},
		rust_analyzer = {},
		vtsls = {
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
		eslint = {},
		tailwindcss = {
			tailwindCSS = {
				classFunctions = { "clsx" },
			},
		},
		cssls = {},
		astro = {},
		vala_ls = {},
		mesonlsp = {},
		blueprint_ls = {},
	}

	for name, settings in pairs(specs) do
		vim.lsp.enable(name)
		vim.lsp.config(name, { settings = settings })
	end
end

do -- ft local options
	local specs = {
		[{ "lua" }] = {
			shiftwidth = 4,
			tabstop = 4,
		},
		[{ "md", "markdown" }] = {
			shiftwidth = 2,
			tabstop = 2,
		},
		[{ "nix" }] = {
			shiftwidth = 2,
			tabstop = 2,
		},
		[{ "nu" }] = {
			shiftwidth = 4,
			tabstop = 4,
		},
		[{
			"css",
			"typescript.jsx",
			"javascript.jsx",
			"typescript",
			"javacript",
			"typescriptreact",
			"javacriptreact",
		}] = {
			shiftwidth = 2,
			tabstop = 2,
		},
		[{ "vala" }] = {
			shiftwidth = 4,
			tabstop = 4,
		},
	}

	for pattern, opts in pairs(specs) do
		vim.api.nvim_create_autocmd("FileType", {
			desc = "Local options for " .. table.concat(pattern, ", "),
			group = vim.api.nvim_create_augroup("lang." .. table.concat(pattern, "-"), { clear = true }),
			pattern = pattern,
			callback = function()
				for k, v in pairs(opts) do
					vim.opt_local[k] = v
				end
			end,
		})
	end
end

do -- icons
	require("mini.icons").setup({
		file = {
			[".go-version"] = { glyph = "", hl = "MiniIconsBlue" },
			["nvim-pack-lock.json"] = { glyph = "", hl = "MiniIconsGreen" },
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
	})
end

do -- comment syntax
	require("ts-comments").setup({
		lang = {
			jinja = "{#- %s -#}",
			vala = "// %s",
			meson = "# %s",
			blueprint = "// %s",
		},
	})
end
