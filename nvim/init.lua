vim.g.lazyvim_json = vim.fn.stdpath("cache") .. "/lazyvim.json"
require("config.lazy")

print(vim.g.lazyvim_json)
