return {
    {
        "nvim-telescope/telescope.nvim",
        opts = {
            defaults = {
                prompt_prefix = " ",
                selection_caret = " ",
                multi_icon = " ",
                initial_mode = "insert",
            },
            pickers = {
                find_files = {
                    hidden = true,
                },
            },
        },
    },

    -- add telescope-fzf-native
    {
        "telescope.nvim",
        dependencies = {
            "nvim-telescope/telescope-fzf-native.nvim",
            build = "make",
            config = function()
                require("telescope").load_extension("fzf")
            end,
        },
    },
}
