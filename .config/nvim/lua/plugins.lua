local lazypath = vim.fn.stdpath('data') .. '/lazy/lazy.nvim'
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    'git',
    'clone',
    '--filter=blob:none',
    'https://github.com/folke/lazy.nvim.git',
    '--branch=stable', -- latest stable release
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

require('lazy').setup({
  -- agda
  'ashinkarov/nvim-agda',

  -- sql
  'nanotee/sqls.nvim',

  -- autopairs
  { "windwp/nvim-autopairs", opts = {} },

  -- dependencies
  'nvim-tree/nvim-web-devicons',

  -- auto tabwidth
  'tpope/vim-sleuth',

  -- show pending keys
  { 'folke/which-key.nvim', opts = {} },

  { -- telescope
    'nvim-telescope/telescope.nvim',
    version = '*',
    dependencies = { 'nvim-lua/plenary.nvim' }
  },
  
  -- diagnostics
  "folke/trouble.nvim",

  -- multiline cursors
  'mg979/vim-visual-multi',

  -- colorschemes
  'Mofiqul/vscode.nvim',
  'Mofiqul/adwaita.nvim',
  'decaycs/decay.nvim',

  -- statusline
  'nvim-lualine/lualine.nvim',

  { -- syntax highlight
    'nvim-treesitter/nvim-treesitter',
    build = ':TSUpdate'
  },

  { -- indentation guides
    'lukas-reineke/indent-blankline.nvim',
    opts = {
      char = '┊',
      show_trailing_blankline_indent = false,
    },
  },

  -- "gcc" to comment
  { 'numToStr/Comment.nvim', opts = {} },

  -- buttom right spinner
  { 'j-hui/fidget.nvim', opts = {} },

  { -- LSP
    'VonHeikemen/lsp-zero.nvim',
    branch = 'v1.x',
    dependencies = {
      {'neovim/nvim-lspconfig'},             -- Required
      {'williamboman/mason.nvim'},           -- Optional
      {'williamboman/mason-lspconfig.nvim'}, -- Optional

      {'hrsh7th/nvim-cmp'},         -- Required
      {'hrsh7th/cmp-nvim-lsp'},     -- Required
      {'hrsh7th/cmp-buffer'},       -- Optional
      {'hrsh7th/cmp-path'},         -- Optional
      {'saadparwaiz1/cmp_luasnip'}, -- Optional
      {'hrsh7th/cmp-nvim-lua'},     -- Optional

      {'L3MON4D3/LuaSnip'},             -- Required
      {'rafamadriz/friendly-snippets'}, -- Optional
    }
  },
  
  -- file tree
  'nvim-tree/nvim-tree.lua',
})
