return {
    {
        "nvim-neo-tree/neo-tree.nvim",
        keys = {
            { "<leader>e", "<Cmd>Neotree focus<CR>", desc = "Explorer NeoTree", remap = true },
        },
        opts = {
            window = {
                mappings = {
                    ["<space>"] = "none",
                    ["l"] = "open",
                    ["h"] = "close_all_subnodes",
                    ["L"] = "open_vsplit",
                },
            },
            event_handlers = {
                {
                    event = "file_opened",
                    handler = function()
                        require("neo-tree.command").execute({ action = "close" })
                    end,
                },
            },
        },
    },
}
