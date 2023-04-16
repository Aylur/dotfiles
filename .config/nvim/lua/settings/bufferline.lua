require("bufferline").setup{
  options = {
    offsets = {
      {
        filetype = "NvimTree",
        text = "File Explorer",
        highlight = "Directory",
        separator = true
      }
    },
    indicator = {
      icon = '▎',
      style = 'icon',
    },
    diagnostics = "nvim_lsp",
    alway_show_bufferline = false,
  },
}
