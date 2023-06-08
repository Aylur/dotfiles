require'nvim-treesitter.configs'.setup {
  ensure_installed = {
    'java',
    'javascript' , 'typescript', 'tsx',
    'scss', 'css', 'html',
    'c', 'cpp', 'rust', 'go',
    'lua', 'vim', 'help', 'query',
    'yuck', 'nix',
  },
  sync_install = false,
  auto_install = true,

  highlight = {
    enable = true,
  },
}
