local function uname()
    local handle = io.popen("uname")
    if handle then
        local res = handle:read("a")
        handle:close()
        return string.match(res, "^%s*(.-)%s*$")
    end
    return nil
end

return {
    {
        "williamboman/mason.nvim",
        -- enable in containers and Mac, but not NixOS
        enabled = io.open("/run/.containerenv", "r") ~= nil or uname() == "Darwin",
    },
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
                astro = {},
                gleam = {},

                denols = {
                    root_dir = require("lspconfig").util.root_pattern("deno.json"),
                },

                vala_ls = {},
                mesonlsp = {},
            },
        },
    },
    {
        "stevearc/conform.nvim",
        opts = {
            formatters_by_ft = {
                nix = { "alejandra" },
            },
        },
    },
}
