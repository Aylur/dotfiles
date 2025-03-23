return {
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
