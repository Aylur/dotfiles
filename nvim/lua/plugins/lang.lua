-- lazy.lang
-- clangd, go, json, markdown, python, rust, typescript, yaml

return {
    { "williamboman/mason.nvim", enabled = false },
    {
        "nvim-treesitter/nvim-treesitter",
        dependencies = {
            { "nushell/tree-sitter-nu" },
        },
        opts = {
            ensure_installed = {
                "lua",
                "nix",

                -- "bash",
                -- "nu",
                --
                -- "javascript",
                -- "jsdoc",
                -- "html",
                -- "scss",
                -- "css",
                -- "svelte",
                --
                -- "luadoc",
                -- "luap",
                -- "query",
                -- "regex",
                -- "vim",
                -- "vimdoc",
                --
                -- "gleam"
            },
        },
    },
    {
        "neovim/nvim-lspconfig",
        opts = {
            servers = {
                nil_ls = {},
                lua_ls = {},

                bashls = {},
                nushell = {},

                cssls = {},
                eslint = {},
                stylelint_lsp = {},
                html = {},

                svelte = {},
                denols = {},
                gleam = {},

                tsserver = {
                    root_dir = require("lspconfig").util.root_pattern("package.json"),
                },
            },
        },
    },
}
