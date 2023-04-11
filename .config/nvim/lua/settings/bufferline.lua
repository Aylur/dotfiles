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
    indicator = "underline",
    separator_style = "slope",
    diagnostics = "nvim_lsp",
    alway_show_bufferline = false,
  }
}
