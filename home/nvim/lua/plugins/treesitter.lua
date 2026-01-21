local TS = require("nvim-treesitter")

local function indent_support(filetype)
    local lang = vim.treesitter.language.get_lang(filetype)
    if lang ~= nil then
        return vim.treesitter.query.get(lang, "indents") ~= nil
    end
end

vim.api.nvim_create_autocmd("PackChanged", {
    group = vim.api.nvim_create_augroup("my.treesitter-update", { clear = true }),
    desc = "Update Treesitter",
    callback = function(e)
        local name, kind = e.data.spec.name, e.data.kind
        if (kind == "update" or kind == "install") and name == "nvim-treesitter" then
            vim.cmd.TSUpdate()
        end
    end,
})

TS.install({
    "bash",
    "diff",
    "json",
    "lua",
    "luadoc",
    "luap",
    "markdown",
    "markdown_inline",
    "printf",
    "regex",
    "toml",
    "vim",
    "vimdoc",
    "xml",
    "yaml",
    "toml",
    "json5",
})

_G.mytreesitter_indentexpr = function()
    local buf = vim.api.nvim_get_current_buf()
    local has_indent = indent_support(vim.bo[buf].filetype)
    return has_indent and TS.indentexpr() or -1
end

vim.api.nvim_create_autocmd("FileType", {
    group = vim.api.nvim_create_augroup("my.treesitter", { clear = true }),
    callback = function(ev)
        pcall(vim.treesitter.start, ev.buf)
        if indent_support(ev.match) then
            vim.opt_local.indentexpr = "v:lua.mytreesitter_indentexpr()"
        end
    end,
})
