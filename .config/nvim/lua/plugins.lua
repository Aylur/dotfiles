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
  { "windwp/nvim-autopairs", opts = {} }, -- autopairs
  'nvim-tree/nvim-web-devicons', -- dependencies
  'tpope/vim-sleuth', -- auto tabwidth
  { 'folke/which-key.nvim', opts = {} }, -- pending keys
  {
    'nvim-telescope/telescope.nvim',
    version = '*',
    dependencies = { 'nvim-lua/plenary.nvim' }
  },
  { "folke/trouble.nvim", opts = {} },-- diagnostics
  'mg979/vim-visual-multi', -- multiline cursors

  -- colorschemes
  'Mofiqul/vscode.nvim',
  'Mofiqul/adwaita.nvim',
  { 'decaycs/decay.nvim', name = 'decay' },
  'nyoom-engineering/oxocarbon.nvim',
  { "catppuccin/nvim", name = "catppuccin", opts = {
    flavour = 'mocha',
    color_overrides = {
      mocha = {
       base = '#161616',
       mantle = '#131313',
       crust = '#111111',
    } } } },
  { 'rose-pine/neovim', name = 'rose-pine', opts = {
    disable_italics = true,
    dark_variant = 'moon',
    groups = { background = '#161616' } } },

  'nvim-lualine/lualine.nvim', -- statusline
  {'akinsho/bufferline.nvim', version = "v3.*" }, --tabline
  'nvim-tree/nvim-tree.lua', -- filetree

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

  { 'numToStr/Comment.nvim', opts = {} }, -- "gcc" to comment
  { 'j-hui/fidget.nvim', opts = {} }, -- buttom right spinner

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

  'elkowar/yuck.vim'
})
