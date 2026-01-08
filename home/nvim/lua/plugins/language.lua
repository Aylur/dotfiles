---@class LangSpecFt
---@field name? string
---@field pattern? string|string[]
---@field locals? table|fun(event: vim.api.keyset.create_autocmd.callback_args): nil

---@class LangSpec
---@field ft? LangSpecFt
---@field formatters? table<string, conform.FiletypeFormatter>
---@field treesitters? string[],
---@field icons? table

local M = {}

local function flatten(tbl, key, default)
	return vim.iter(tbl)
		:map(function(l)
			return l[key] or default or {}
		end)
		:flatten()
		:totable()
end

local function join(specs, key, default)
	local result = {}
	for _, s in ipairs(specs) do
		result = vim.tbl_extend("error", result, s[key] or default or {})
	end
	return result
end

---@param specs LangSpec[]
function M.setup(specs)
	-- setup locals hook
	for _, s in ipairs(specs) do
		if s.ft then
			vim.api.nvim_create_autocmd("FileType", {
				desc = s.ft.name .. "options",
				group = vim.api.nvim_create_augroup("lang." .. s.ft.name, { clear = true }),
				pattern = s.ft.pattern,
				callback = function(args)
					if type(s.ft.locals) == "function" then
						s.ft.locals(args)
					elseif type(s.ft.locals) == "table" then
						---@diagnostic disable-next-line: param-type-mismatch
						for k, v in pairs(s.ft.locals) do
							vim.opt_local[k] = v
						end
					end
				end,
			})
		end
	end

	require("conform").setup({ formatters_by_ft = join(specs, "formatters") })
	require("nvim-treesitter").install(flatten(specs, "treesitters"))
	require("mini.icons").setup({ file = join(specs, "icons") })
	require("ts-comments").setup({ lang = join(specs, "comments") })
end

return M
