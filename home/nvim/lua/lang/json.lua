vim.lsp.config("jsonls", {
    settings = {
        json = {
            validate = { enable = true },
            schemas = require("schemastore").json.schemas({
                select = {
                    "package.json",
                    "tsconfig.json",
                },
            }),
        },
    },
})

vim.lsp.enable({ "jsonls" })

---@type LangSpec
return {
    treesitters = {
        "json",
    },
    formatters = {
        json = { "prettier" },
        jsonc = { "prettier" },
        json5 = { "prettier" },
        yaml = { "prettier" },
    },
}
