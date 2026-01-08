local color = require("snacks").util.color

local last_input = ""

vim.on_key(function(ch)
    if ch ~= "" then
        last_input = (last_input .. vim.fn.keytrans(ch)):sub(-24)
    end
end, vim.api.nvim_create_namespace("last_input"))

local mode = {
    "mode",
    padding = { left = 0, right = 1 },
}

local branch = {
    "branch",
    color = { fg = color("Keyword") },
}

local filename = {
    "filename",
    path = 1,
    symbols = {
        modified = " ",
        readonly = " ",
        unnamed = "",
        newfile = "[New]",
    },
}

local diff = {
    "diff",
    symbols = {
        added = " ",
        modified = " ",
        removed = " ",
    },
    source = function()
        local gitsigns = vim.b.gitsigns_status_dict
        if gitsigns then
            return {
                added = gitsigns.added,
                modified = gitsigns.changed,
                removed = gitsigns.removed,
            }
        end
    end,
}

local diagnostic = {
    "diagnostics",
    symbols = {
        error = " ",
        warn = " ",
        info = " ",
        hint = " ",
    },
}

local location = {
    "location",
    color = { fg = color("Title") },
}

local command = {
    function()
        return last_input
    end,
    color = function()
        return { fg = color("Normal") }
    end,
}

local macro = {
    function()
        local reg = vim.fn.reg_recording()
        return reg ~= "" and "@" .. reg or ""
    end,
    color = function()
        return { fg = color("Constant") }
    end,
}

require("lualine").setup({
    options = {
        component_separators = { left = "", right = "" },
        section_separators = { left = "", right = "" },
        globalstatus = true,
        theme = {
            normal = {
                a = { fg = color("Normal", "fg") },
                b = { fg = color("Normal", "fg") },
                c = { fg = color("Normal", "fg") },
            },
            insert = { a = { fg = color("GitSignsAdd") } },
            visual = { a = { fg = color("Visual", "bg") } },
            replace = { a = { fg = color("GitSignsChange") } },
            command = { a = { fg = color("Title") } },
            terminal = { a = { fg = color("Keyword") } },
        },
    },
    sections = {
        lualine_a = { mode },
        lualine_b = { branch, filename },
        lualine_c = { diff },
        lualine_x = {
            diagnostic,
            macro,
            "searchcount",
            "selectioncount",
        },
        lualine_y = { command },
        lualine_z = { location },
    },
})
