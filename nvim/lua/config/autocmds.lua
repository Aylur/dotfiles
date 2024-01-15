vim.api.nvim_create_autocmd({ "FileType" }, {
    pattern = { "ts", "svelte", "js" },
    callback = function()
        vim.b.autoformat = false
    end,
})

vim.api.nvim_create_autocmd("BufWritePre", {
    pattern = { "*.tsx", "*.ts", "*.jsx", "*.js" },
    command = "silent! EslintFixAll",
    group = vim.api.nvim_create_augroup("MyAutocmdsJavaScripFormatting", {}),
})

vim.api.nvim_create_autocmd("FileType", {
    pattern = { "nix", "md" },
    callback = function()
        vim.opt_local.shiftwidth = 2
        vim.opt_local.tabstop = 2
    end
})

vim.api.nvim_create_autocmd("BufWritePre", {
    pattern = "*.nix",
    callback = function(args)
        require("conform").format({ bufnr = args.buf })
    end,
})
