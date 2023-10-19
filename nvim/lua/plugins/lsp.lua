return {
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
                marksman = {},
                nil_ls = {},
                lua_ls = {},
                gopls = {},
                ruff_lsp = {},

                -- FIXME: remove after uni
                sqlls = {},
            },
        },
    },
}
