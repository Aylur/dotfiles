local Util = require("nucharm.util")

local M = {}

---@type fun(c: nucharm.Palette):table<string,vim.api.keyset.highlight|string>
function M.get(c)
  -- stylua: ignore
    return {
        ["@lsp.type.boolean"]                      = "@boolean",
        ["@lsp.type.builtinType"]                  = "@type.builtin",
        ["@lsp.type.comment"]                      = "@comment",
        ["@lsp.type.decorator"]                    = "@attribute",
        ["@lsp.type.deriveHelper"]                 = "@attribute",
        ["@lsp.type.enum"]                         = "@type",
        ["@lsp.type.enumMember"]                   = "@constant",
        ["@lsp.type.escapeSequence"]               = "@string.escape",
        ["@lsp.type.formatSpecifier"]              = "@markup.list",
        ["@lsp.type.generic"]                      = "@variable",
        ["@lsp.type.interface"]                    = "@type",
        ["@lsp.type.keyword"]                      = "@keyword",
        ["@lsp.type.lifetime"]                     = "@keyword.storage",
        ["@lsp.type.namespace"]                    = "@module",
        ["@lsp.type.namespace.python"]             = "@variable",
        ["@lsp.type.number"]                       = "@number",
        ["@lsp.type.operator"]                     = "@operator",
        ["@lsp.type.parameter"]                    = "@variable.parameter",
        ["@lsp.type.property"]                     = "@property",
        ["@lsp.type.selfKeyword"]                  = "@variable.builtin",
        ["@lsp.type.selfTypeKeyword"]              = "@variable.builtin",
        ["@lsp.type.string"]                       = "@string",
        ["@lsp.type.typeAlias"]                    = "@type.definition",
        ["@lsp.type.typeParameter"]                = "@type",
        ["@lsp.type.unresolvedReference"]          = { undercurl = true, sp = c.red },
        ["@lsp.type.variable"]                     = {}, -- use treesitter styles for regular variables
        ["@lsp.typemod.class.defaultLibrary"]      = "@type.builtin",
        ["@lsp.typemod.enum.defaultLibrary"]       = "@type.builtin",
        ["@lsp.typemod.enumMember.defaultLibrary"] = "@constant.builtin",
        ["@lsp.typemod.function.defaultLibrary"]   = "@function.builtin",
        ["@lsp.typemod.keyword.async"]             = "@keyword.coroutine",
        ["@lsp.typemod.keyword.injected"]          = "@keyword",
        ["@lsp.typemod.macro.defaultLibrary"]      = "@function.builtin",
        ["@lsp.typemod.method.defaultLibrary"]     = "@function.builtin",
        ["@lsp.typemod.operator.injected"]         = "@operator",
        ["@lsp.typemod.string.injected"]           = "@string",
        ["@lsp.typemod.struct.defaultLibrary"]     = "@type.builtin",
        ["@lsp.typemod.type.defaultLibrary"]       = { fg = c.blue },
        ["@lsp.typemod.typeAlias.defaultLibrary"]  = { fg = c.blue },
        ["@lsp.typemod.variable.callable"]         = "@function",
        ["@lsp.typemod.variable.defaultLibrary"]   = "@variable.builtin",
        ["@lsp.typemod.variable.injected"]         = "@variable",
        ["@lsp.typemod.variable.static"]           = "@constant",
    }
end

return M
