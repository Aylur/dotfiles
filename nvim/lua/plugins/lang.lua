-- disable mason on nixos and containers
local function enable_mason()
	local id = vim.fn.system("cat /etc/os-release | grep ^ID=")
	local os_name = id:match("^%s*(.-)%s*$"):gsub("ID=", "")
	local container = io.open("/run/.containerenv", "r") ~= nil
	return container or os_name ~= "nixos"
end

return {
	{
		"williamboman/mason.nvim",
		enabled = enable_mason(),
	},
}
