local icons = require("lazyvim.config").icons

local diff = {
    "diff",
    symbols = {
        added = icons.git.added,
        modified = icons.git.modified,
        removed = icons.git.removed,
    },
}

local diagnostic = {
    "diagnostics",
    symbols = {
        error = icons.diagnostics.Error,
        warn = icons.diagnostics.Warn,
        info = icons.diagnostics.Info,
        hint = icons.diagnostics.Hint,
    },
}

local filename = {
    "filename",
    cond = function()
        local bufs_loaded = {}

        for i, buf_hndl in ipairs(vim.api.nvim_list_bufs()) do
            if vim.api.nvim_buf_is_loaded(buf_hndl) then
                bufs_loaded[i] = buf_hndl
            end
        end

        return #bufs_loaded == 2
    end,
    symbols = {
        modified = " ",
        readonly = "[ro]",
        unnamed = "[unnamed]",
        newfile = "[new]",
    },
}

local navic = {
    function()
        return require("nvim-navic").get_location()
    end,
    cond = function()
        return package.loaded["nvim-navic"] and require("nvim-navic").is_available()
    end,
}

local position = {
    "location",
    padding = { left = 1, right = 1 },
}

return {
    {
        "nvim-lualine/lualine.nvim",
        event = "VeryLazy",
        opts = function()
            return {
                options = {
                    -- component_separators = { left = "╲", right = "│" },
                    -- section_separators = { left = "", right = "" },
                    component_separators = { left = "│", right = "│" },
                    section_separators = { left = "", right = "" },
                    theme = "auto",
                    globalstatus = true,
                    disabled_filetypes = { statusline = { "dashboard", "alpha" } },
                },
                sections = {
                    lualine_a = { "mode" },
                    lualine_b = { "branch", diff },
                    lualine_c = { diagnostic, navic },
                    lualine_x = { "searchcount", "selectioncount", "encoding", "filetype" },
                    lualine_y = { filename },
                    lualine_z = { position },
                },
                extensions = { "neo-tree", "lazy" },
            }
        end,
    },
}
