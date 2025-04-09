local M = {}

M.load = function()
	vim.cmd("hi clear")
	vim.g.colors_name = "nucharm"

	local palette = require("nucharm.palettes.dark")

	---@type table<string,vim.api.keyset.highlight|string>
	local groups = vim.tbl_extend(
		"force",
		require("nucharm.groups.kinds").get(palette),
		require("nucharm.groups.base").get(palette),
		require("nucharm.groups.treesitter").get(palette),
		require("nucharm.groups.semantic_tokens").get(palette)
	)

	for group, hl in pairs(groups) do
		if type(hl) == "string" then
			vim.api.nvim_set_hl(0, group, { link = hl })
		else
			vim.api.nvim_set_hl(0, group, hl)
		end
	end
end

M.setup = function()
	-- TODO: todo
end

return M
