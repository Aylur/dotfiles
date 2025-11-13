return {
	{
		"folke/ts-comments.nvim",
		opts = {
			lang = {
				vala = "// %s",
				meson = "# %s",
				blueprint = "// %s",
			},
		},
	},
	{
		"neovim/nvim-lspconfig",
		opts = {
			servers = {
				vala_ls = {},
				mesonlsp = {},
				blueprint_ls = {},
			},
		},
	},
	{
		"nvim-treesitter/nvim-treesitter",
		opts = {
			ensure_installed = {
				"vala",
				"meson",
				"blueprint",
			},
		},
	},
}
