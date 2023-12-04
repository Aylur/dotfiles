return {
    {
        "nvim-treesitter/nvim-treesitter",
        opts = {
            ensure_installed = {
                "bash",
                "c",
                "cpp",
                "go",
                "nix",

                "html",
                "javascript",
                "json",
                "jsdoc",
                "yaml",
                "svelte",
                "scss",
                "css",
                "tsx",
                "typescript",

                "lua",
                "luadoc",
                "luap",

                "markdown",
                "markdown_inline",

                "python",
                "query",
                "regex",
                "vim",
                "vimdoc",

                -- FIXME: remove after uni
                "java",
                "sql",
            },
        },
    },
}
