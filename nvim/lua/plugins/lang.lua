vim.g.lazyvim_check_order = false

return {
	{
		"williamboman/mason.nvim",
		-- only enable mason when nix is not in path
		enabled = vim.fn.executable("nix") == 0,
	},
	{ import = "plugins.lang" },
}
