require('telescope').load_extension('media_files')
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
  extensions = {
    media_files = {
      filetypes = { 'png', 'webp', 'jpg', 'jpeg', 'mp4', 'webm', 'pdf' },
      find_cmd = 'rg',
    }
  },
}
