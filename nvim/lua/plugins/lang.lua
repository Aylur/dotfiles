return {
    {
        "nvim-treesitter/nvim-treesitter",
        opts = {
            ensure_installed = {
                "bash",
                "c",
                "cpp",
                "go",
                "nix",

                "html",
                "javascript",
                "json",
                "jsdoc",
                "yaml",
                "svelte",
                "scss",
                "css",
                "tsx",
                "typescript",

                "lua",
                "luadoc",
                "luap",

                "python",
                "query",
                "regex",
                "vim",
                "vimdoc",

                -- FIXME: remove after uni
                "sql",
            },
        },
    },
    {
        "neovim/nvim-lspconfig",
        opts = {
            servers = {
                bashls = {},
                clangd = {},
                cssls = {},
                eslint = {},
                stylelint_lsp = {},
                html = {},
                svelte = {},
                tsserver = {},
                nil_ls = {},
                lua_ls = {},
                gopls = {},
                ruff_lsp = {},
                nushell = {},

                -- FIXME: remove after uni
                sqlls = {},
            },
        },
    },
}
