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
        opts = {
            ensure_installed = {
                "lua",
                "nix",
                "bash",
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

                denols = {
                    root_dir = require("lspconfig").util.root_pattern("deno.json"),
                },

                cssls = {},
                cssmodules_ls = {},
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
