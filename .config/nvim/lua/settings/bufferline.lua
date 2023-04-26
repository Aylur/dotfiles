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
    always_show_bufferline = false,
  },
}
