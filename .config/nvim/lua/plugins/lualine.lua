local Util = require("lazyvim.util")
local red = "#c35d72"
local green = "#46a96f"

local battery = {
    function()
        --- @diagnostic disable-next-line: param-type-mismatch
        local percentage = math.ceil(tonumber(vim.fn.system("acpi -b | awk '{print $4}' | cut -d'%' -f1")))
        local state = table.concat(vim.fn.systemlist("acpi -b | awk '{print $3}' | cut -d',' -f1"), "")
        local powered = "󰚥"
        if state == "Full" then
            return "󰂄"
        end
        if state == "Discharging" then
            powered = ""
        end

        local icons = { "󰂎", "󰁻", "󰁼", "󰁽", "󰁾", "󰁿", "󰂀", "󰂁", "󰂂", "󰁹" }
        return icons[math.ceil(percentage / 10)] .. powered .. " " .. tostring(percentage) .. "󱉸"
    end,
    cond = function()
        local state = table.concat(vim.fn.systemlist("acpi -b | awk '{print $3}' | cut -d',' -f1"), "")
        return state ~= "Full"
    end,
    draw_empty = false,
    padding = { left = 0, right = 1 },
    color = function()
        local percentage = tonumber(vim.fn.system("acpi -b | awk '{print $4}' | cut -d'%' -f1"))
        local state = table.concat(vim.fn.systemlist("acpi -b | awk '{print $3}' | cut -d',' -f1"), "")
        if state == "Charging" or state == "Full" then
            return { fg = green }
        end
        if state == "Discharging" then
            return { fg = percentage < 30 and red or nil }
        end

        return nil
    end,
}

local clock = {
    function()
        return os.date("%H:%M  ")
    end,
    padding = 0,
}

return {
    {
        "nvim-lualine/lualine.nvim",
        event = "VeryLazy",
        opts = function()
            local icons = require("lazyvim.config").icons

            return {
                options = {
                    component_separators = { left = "╲", right = "│" },
                    section_separators = { left = "", right = "" },
                    theme = "auto",
                    globalstatus = true,
                    disabled_filetypes = { statusline = { "dashboard", "alpha" } },
                },
                sections = {
                    lualine_a = { "mode" },
                    lualine_b = {
                        "branch",
                        {
                            "diff",
                            symbols = {
                                added = icons.git.added,
                                modified = icons.git.modified,
                                removed = icons.git.removed,
                            },
                        },
                    },
                    lualine_c = {
                        {
                            "diagnostics",
                            symbols = {
                                error = icons.diagnostics.Error,
                                warn = icons.diagnostics.Warn,
                                info = icons.diagnostics.Info,
                                hint = icons.diagnostics.Hint,
                            },
                        },
                        -- stylua: ignore
                        {
                            function() return require("nvim-navic").get_location() end,
                            cond = function() return package.loaded["nvim-navic"] and require("nvim-navic").is_available() end,
                        },
                    },
                    lualine_x = {
                        -- stylua: ignore
                        {
                            function() return require("noice").api.status.command.get() end,
                            cond = function() return package.loaded["noice"] and require("noice").api.status.command.has() end,
                            color = Util.fg("Statement"),
                        },
                        -- stylua: ignore
                        {
                            function() return require("noice").api.status.mode.get() end,
                            cond = function() return package.loaded["noice"] and require("noice").api.status.mode.has() end,
                            color = Util.fg("Constant"),
                        },
                        -- stylua: ignore
                        {
                            function() return "  " .. require("dap").status() end,
                            cond = function () return package.loaded["dap"] and require("dap").status() ~= "" end,
                            color = Util.fg("Debug"),
                        },
                        {
                            require("lazy.status").updates,
                            cond = require("lazy.status").has_updates,
                            color = Util.fg("Special"),
                        },
                    },
                    lualine_y = { battery },
                    lualine_z = { clock },
                },
                extensions = { "neo-tree", "lazy" },
            }
        end,
    },
}
