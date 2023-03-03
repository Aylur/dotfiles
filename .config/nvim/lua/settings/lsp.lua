local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = {omit = {'<Up>', '<Down>'}},
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

-- (Optional) Configure lua language server for neovim
lsp.nvim_workspace()

lsp.ensure_installed({
  'bashls', -- bash
  'clangd', -- c, c++
  'cssls', -- css
  'eslint', -- js
  'html', -- html
  'jdtls', -- java
  'tsserver', -- typescript
  'marksman', -- markdown
  'nil_ls', -- nix
  'rust_analyzer' -- rust
})

lsp.setup()
