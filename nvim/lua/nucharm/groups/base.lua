local Util = require("nucharm.util")

local M = {}

---@type fun(c: nucharm.Palette):table<string,vim.api.keyset.highlight|string>
function M.get(c)
	local lighten = function(color, alpha)
		return Util.blend(color, alpha, c.neutral[9])
	end

	local darken = function(color, alpha)
		return Util.blend(color, alpha, c.neutral[1])
	end

	--- :help highlight-groups
	return {
		ColorColumn = { bg = c.neutral[3] }, -- Used for the columns set with 'colorcolumn'.
		Conceal = { fg = c.red }, -- Placeholder characters substituted for concealed text (see 'conceallevel').
		CurSearch = { fg = c.red }, -- Used for highlighting a search pattern under the cursor (see 'hlsearch').
		Cursor = "Normal", -- Character under the cursor.
		lCursor = "Normal", -- Character under the cursor when |language-mapping| is used (see 'guicursor').
		CursorIM = "Normal", -- Like Cursor, but used when in IME mode. *CursorIM*
		CursorColumn = "ColorColumn", -- Screen-column at the cursor, when 'cursorcolumn' is set.
		CursorLine = "ColorColumn", -- Screen-line at the cursor, when 'cursorline' is set. Low-priority if foreground (ctermfg OR guifg) is not set.
		Directory = { fg = c.blue }, -- Directory names (and other special names in listings).
		DiffAdd = { bg = darken(c.green, 0.1) }, -- Diff mode: Added line. |diff.txt|
		DiffChange = { bg = darken(c.orange, 0.1) }, -- Diff mode: Changed line. |diff.txt|
		DiffDelete = { bg = darken(c.red, 0.1) }, -- Diff mode: Deleted line. |diff.txt|
		-- DiffText = {}, -- Diff mode: Changed text within a changed line. |diff.txt|
		EndOfBuffer = "NonText", -- Filler lines (~) after the end of the buffer. By default, this is highlighted like |hl-NonText|.
		ErrorMsg = { fg = c.red }, -- Error messages on the command line.
		WinSeparator = { fg = c.neutral[4] }, -- Separators between window splits.
		Folded = { bg = c.neutral[4] }, -- Line used for closed folds.
		FoldColumn = "Normal", -- 'foldcolumn'
		SignColumn = "Comment", -- Column where |signs| are displayed.
		IncSearch = "Visual", -- 'incsearch' highlighting; also used for the text replaced with ":s///c".
		Substitute = "IncSearch", -- |:substitute| replacement text highlighting.
		LineNr = { fg = c.neutral[4] }, -- Line number for ":number" and ":#" commands, and when 'number' or 'relativenumber' option is set.
		LineNrAbove = "Comment", -- Line number for when the 'relativenumber' option is set, above the cursor line.
		LineNrBelow = "Comment", -- Line number for when the 'relativenumber' option is set, below the cursor line.
		CursorLineNr = { fg = c.neutral[7] }, -- Like LineNr when 'cursorline' is set and 'cursorlineopt' contains "number" or is "both", for the cursor line.
		MatchParen = { fg = c.cyan, bg = c.neutral[4] }, -- Character under the cursor or just before it, if it is a paired bracket, and its match. |pi_paren.txt|
		ModeMsg = { fg = c.neutral[6], bold = true }, -- 'showmode' message (e.g., "-- INSERT --").
		MsgArea = { fg = c.neutral[6] }, -- Area for messages and command-line, see also 'cmdheight'.
		MoreMsg = { fg = c.neutral[6] }, -- |more-prompt|
		NonText = { fg = c.neutral[6] }, -- '@' at the end of the window, characters from 'showbreak' and other characters that do not really exist in the text (e.g., ">" displayed when a double-wide character doesn't fit at the end of the line). See also |hl-EndOfBuffer|.
		Normal = { fg = c.neutral[8], bg = c.neutral[2] }, -- Normal text.
		NormalFloat = { fg = c.neutral[8] }, -- Normal text in floating windows.
		FloatBorder = { fg = c.blue }, -- Border of floating windows.
		FloatTitle = { fg = c.orange }, -- Title of floating windows.
		FloatFooter = "FloatTitle", -- Footer of floating windows.
		NormalNC = "Normal", -- Normal text in non-current windows.
		Pmenu = { bg = c.neutral[3], fg = c.neutral[8] }, -- Popup menu: Normal item.
		PmenuMatch = { bg = c.neutral[3], fg = c.blue }, -- Popup menu: Matched text in normal item.
		PmenuSel = { bg = c.neutral[4], fg = c.neutral[9] }, -- Popup menu: Selected item.
		PmenuMatchSel = { bg = c.neutral[4], fg = c.blue }, -- Popup menu: Matched text in selected item.
		PmenuSbar = { bg = c.neutral[5] }, -- Popup menu: scrollbar.
		PmenuThumb = { bg = c.neutral[6] }, -- Popup menu: Thumb of the scrollbar.
		Question = { fg = c.blue }, -- |hit-enter| prompt and yes/no questions.
		QuickFixLine = { bg = c.neutral[5], bold = true }, -- Current |quickfix| item in the quickfix window. Combined with |hl-CursorLine| when the cursor is there.
		Search = "Visual", -- Last search pattern highlighting (see 'hlsearch'). Also used for similar items that need to stand out.
		SpecialKey = { fg = c.neutral[3] }, -- Unprintable characters: Text displayed differently from what it really is. But not 'listchars' whitespace. |hl-Whitespace|
		SpellBad = { sp = c.red, underline = true }, -- Word that is not recognized by the spellchecker. |spell| Combined with the highlighting used otherwise.
		SpellCap = { sp = c.orange, underline = true }, -- Word that should start with a capital. |spell| Combined with the highlighting used otherwise.
		SpellLocal = { sp = c.blue, underline = true }, -- Word that is recognized by the spellchecker as one that is used in another region. |spell| Combined with the highlighting used otherwise.
		SpellRare = { sp = c.cyan, underline = true }, -- Word that is recognized by the spellchecker as one that is hardly ever used. |spell| Combined with the highlighting used otherwise.
		StatusLine = { bg = c.neutral[2], fg = c.neutral[8] }, -- Status line of current window.
		StatusLineNC = { bg = c.neutral[1], fg = c.neutral[7] }, -- Status lines of not-current windows.
		TabLine = { bg = c.neutral[1], fg = c.neutral[5] }, -- Tab pages line, not active tab page label.
		TabLineFill = { bg = c.neutral[1] }, -- Tab pages line, where there are no labels.
		TabLineSel = { bg = c.neutral[1], fg = c.blue }, -- Tab pages line, active tab page label.
		Title = { fg = c.blue, bold = true }, -- Titles for output from ":set all", ":autocmd" etc.
		Visual = { bg = c.yellow, fg = c.neutral[1] }, -- Visual mode selection.
		VisualNOS = { bg = c.neutral[4] }, -- Visual mode selection when vim is "Not Owning the Selection".
		WarningMsg = { fg = c.red }, -- Warning messages.
		Whitespace = { fg = c.neutral[3] }, -- "nbsp", "space", "tab", "multispace", "lead" and "trail" in 'listchars'.
		WildMenu = { bg = c.blue }, -- Current match in 'wildmenu' completion.
		WinBar = "StatusLine", -- Window bar of current window.
		WinBarNC = "StatusLineNC", -- Window bar of not-current windows.

		helpCommand = { fg = c.blue },
		htmlH1 = { fg = c.magenta, bold = true },
		htmlH2 = { fg = c.blue, bold = true },
		qfFileName = { fg = c.blue },
		qfLineNr = { fg = c.neutral[7] },

		-- These groups are for the native LSP client. Some other LSP clients may
		-- use these groups, or use their own.
		LspReferenceText = { bg = c.neutral[4] }, -- used for highlighting "text" references
		LspReferenceRead = "LspReferenceText", -- used for highlighting "read" references
		LspReferenceWrite = "LspReferenceText", -- used for highlighting "write" references
		LspSignatureActiveParameter = { bg = c.neutral[3], bold = true },
		LspCodeLens = "Comment",
		LspInlayHint = { fg = c.neutral[4] },
		LspInfoBorder = { fg = c.blue },

		-- -- diagnostics
		DiagnosticError = { fg = c.red }, -- Used as the base highlight group. Other Diagnostic highlights link to this by default
		DiagnosticWarn = { fg = c.orange }, -- Used as the base highlight group. Other Diagnostic highlights link to this by default
		DiagnosticInfo = { fg = c.blue }, -- Used as the base highlight group. Other Diagnostic highlights link to this by default
		DiagnosticHint = { fg = c.cyan }, -- Used as the base highlight group. Other Diagnostic highlights link to this by default
		DiagnosticUnnecessary = {}, -- Used as the base highlight group. Other Diagnostic highlights link to this by default
		DiagnosticVirtualTextError = { bg = darken(c.red, 0.1), fg = c.red }, -- Used for "Error" diagnostic virtual text
		DiagnosticVirtualTextWarn = { bg = darken(c.orange, 0.1), fg = c.orange }, -- Used for "Warning" diagnostic virtual text
		DiagnosticVirtualTextInfo = { bg = darken(c.blue, 0.1), fg = c.blue }, -- Used for "Information" diagnostic virtual text
		DiagnosticVirtualTextHint = { bg = darken(c.cyan, 0.1), fg = c.cyan }, -- Used for "Hint" diagnostic virtual text
		DiagnosticUnderlineError = { undercurl = true, sp = c.red }, -- Used to underline "Error" diagnostics
		DiagnosticUnderlineWarn = { undercurl = true, sp = c.orange }, -- Used to underline "Warning" diagnostics
		DiagnosticUnderlineInfo = { undercurl = true, sp = c.blue }, -- Used to underline "Information" diagnostics
		DiagnosticUnderlineHint = { undercurl = true, sp = c.cyan }, -- Used to underline "Hint" diagnostics

		-- Health
		healthError = { fg = c.red },
		healthSuccess = { fg = c.green },
		healthWarning = { fg = c.orange },
	}
end

return M
