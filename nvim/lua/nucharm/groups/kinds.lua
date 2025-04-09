local M = {}

---@type fun(c: nucharm.Palette):table<string,vim.api.keyset.highlight|string>
function M.get(c)
    return {
        Comment = { fg = c.neutral[5] },
        Bold = { bold = true },
        Italic = { italic = true },
        Underlined = { underline = true },

        Character = { fg = c.cyan },
        Constant = { fg = c.yellow },
        Debug = { fg = c.orange },
        Delimiter = { fg = c.neutral[9] },
        Error = { fg = c.red },
        Function = { fg = c.blue },
        Identifier = { fg = c.magenta[8] },
        Keyword = { fg = c.magenta },
        Operator = { fg = c.cyan },
        PreProc = { fg = c.cyan },
        Special = { fg = c.pink },
        Statement = { fg = c.magenta },
        String = { fg = c.green },
        Todo = { bg = c.cyan, fg = c.neutral[1] },
        Type = { fg = c.yellow },

        Array = { fg = c.neutral[9] },
        Boolean = "Constant",
        Class = "Type",
        Constructor = "Type",
        Enum = "Type",
        EnumMember = "Type",
        Event = { fg = c.red },
        Field = { fg = c.blue },
        File = { fg = c.neutral[8] },
        Folder = { fg = c.blue },
        Interface = "Type",
        Key = { fg = c.yellow },
        Method = "Field",
        Module = { fg = c.red },
        Namespace = { fg = c.orange },
        Null = "Constant",
        Number = "Constant",
        Object = "Constant",
        Package = "Module",
        Property = "Text",
        Reference = { fg = c.pink },
        Snippet = "Conceal",
        Struct = "Type",
        Unit = "Type",
        Text = { fg = c.neutral[8] },
        TypeParameter = { fg = c.yellow },
        Variable = "Text",
        Value = "String",
    }
end

return M
