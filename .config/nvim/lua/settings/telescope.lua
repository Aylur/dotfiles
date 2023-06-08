local fb_actions = require "telescope._extensions.file_browser.actions"

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
    },
    file_browser = {
      hijack_netrw = true,
      mappings = {
        ["n"] = {
          ["a"] = fb_actions.create,
          ["r"] = fb_actions.rename,
          ["m"] = fb_actions.move,
          ["y"] = fb_actions.copy,
          ["d"] = fb_actions.remove,
          ["o"] = fb_actions.open,
          ["h"] = fb_actions.goto_parent_dir,
          ["e"] = fb_actions.goto_home_dir,
          ["w"] = fb_actions.goto_cwd,
          ["l"] = fb_actions.change_cwd,
          ["f"] = fb_actions.toggle_browser,
          ["H"] = fb_actions.toggle_hidden,
          ["s"] = fb_actions.toggle_all,
        },
      },
    },
  },
}

require('telescope').load_extension('media_files')
require('telescope').load_extension('file_browser')
