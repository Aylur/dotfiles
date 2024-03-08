-- lazy.lang
-- clangd, go, json, markdown, python, rust, typescript, yaml

return {
    {
        "nvim-treesitter/nvim-treesitter",
        dependencies = {
            { "nushell/tree-sitter-nu" },
        },
        opts = {
            ensure_installed = {
                "bash",
                "nix",
                "nu",

                "html",
                "javascript",
                "jsdoc",
                "svelte",
                "scss",
                "css",

                "lua",
                "luadoc",
                "luap",

                "query",
                "regex",
                "vim",
                "vimdoc",
            },
        },
    },
    {
        "neovim/nvim-lspconfig",
        opts = {
            servers = {
                bashls = {},
                cssls = {},
                eslint = {},
                stylelint_lsp = {},
                html = {},
                svelte = {},
                nil_ls = {},
                lua_ls = {},
                nushell = {},
                denols = {},
                tsserver = {
                    root_dir = require('lspconfig').util.root_pattern("package.json")
                },
            },
        },
    },
}
