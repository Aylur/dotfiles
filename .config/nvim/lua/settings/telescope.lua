require('telescope').setup {
  defaults = {
    prompt_prefix = ' ',
    selection_caret = ' ',
    multi_icon = ' ',
    initial_mode = 'insert',
  },
  pickers = {
    find_files = {
      hidden = true
    },
  },
}
