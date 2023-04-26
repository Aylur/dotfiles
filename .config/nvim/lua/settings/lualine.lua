local red = '#c35d72'
local green = '#46a96f'

local battery = {
  function ()
    local percentage = math.ceil(tonumber(vim.fn.system("acpi -b | awk '{print $4}' | cut -d'%' -f1")))
    local state = table.concat(vim.fn.systemlist("acpi -b | awk '{print $3}' | cut -d',' -f1"), '')
    local powered = '󰚥'
    if state == 'Full' then return '󰂄' end
    if state == 'Discharging' then powered = '' end

    local icons = { '', '', '', '', '', '', '', '', '', '' }
    return icons[math.ceil(percentage/10)] .. powered .. ' ' .. tostring(percentage) .. '󱉸'
  end,
  cond = function ()
    local state = table.concat(vim.fn.systemlist("acpi -b | awk '{print $3}' | cut -d',' -f1"), '')
    return state ~= 'Full'
  end,
  draw_empty = false,
  padding = { left = 0, right = 1 },
  color = function ()
    local percentage = tonumber(vim.fn.system("acpi -b | awk '{print $4}' | cut -d'%' -f1"))
    local state = table.concat(vim.fn.systemlist("acpi -b | awk '{print $3}' | cut -d',' -f1"), '')
    if state == 'Charging' or state == 'Full' then
      return { fg = green }
    end
    if state == 'Discharging' then
      return { fg = percentage < 30 and red or nil }
    end

    return nil
  end
}

local clock = {
  function ()
    return os.date("%H:%M  ")
  end,
  padding = 0,

}

require('lualine').setup {
  options = {
    icons_enabled = true,
    theme = 'auto',
    component_separators = { left = '│', right = '│'},
    section_separators = { left = '', right = ''},
    globalstatus = true,
    refresh = { statusline = 1000 }
  },
  sections = {
    lualine_a = {'mode'},
    lualine_b = {'branch', 'diff'},
    lualine_c = {'diagnostics'},
    lualine_x = {'location'},
    lualine_y = { battery },
    lualine_z = { clock },
  },
  extensions = { 'nvim-tree' }
}

-- upower -i /org/freedesktop/UPower/devices/battery_BAT0 | grep percentage | awk '{print $2}'
