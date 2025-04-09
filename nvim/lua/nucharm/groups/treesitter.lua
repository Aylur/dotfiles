local M = {}

---@type fun(c: nucharm.Palette):table<string,vim.api.keyset.highlight|string>
function M.get(c)
	--- :help treesitter-highlight-groups
	return {
		["@variable"] = "Variable", -- various variable names
		["@variable.builtin"] = { fg = c.red }, -- built-in variable names (e.g. `this`, `self`)
		["@variable.parameter"] = { fg = c.orange }, -- parameters of a function
		["@variable.parameter.builtin"] = { fg = c.pink }, -- special parameters (e.g. `_`, `it`)
		["@variable.member"] = "Field", -- object and struct fields

		["@constant"] = "Constant", -- constant identifiers
		["@constant.builtin"] = "@constant", -- built-in constant values
		["@constant.macro"] = "@constant", -- constants defined by the preprocessor

		["@module"] = "Module", -- modules or namespaces
		["@module.builtin"] = "@module", -- built-in modules or namespaces
		["@label"] = { fg = c.cyan }, -- `GOTO` and other labels (e.g. `label:` in C)

		["@string"] = "String", -- string literals
		["@string.documentation"] = "Comment", -- string documenting code (e.g. Python docstrings)
		["@string.regexp"] = { fg = c.cyan }, -- regular expressions
		["@string.escape"] = { fg = c.pink }, -- escape sequences
		["@string.special"] = { fg = c.cyan }, -- other special strings (e.g. dates)
		["@string.special.url"] = { fg = c.magenta, underline = true }, -- URIs (e.g. hyperlinks)

		["@character"] = { fg = c.cyan }, -- character literals
		-- ["@character.special"] = {}, -- special characters (e.g. wildcards)
		--
		["@boolean"] = "Boolean", -- boolean literals
		["@number"] = "Number", -- numeric literals
		["@number.float"] = "@number", -- floating-point number literals

		["@type"] = "Type", -- type or class definitions and annotations
		["@type.builtin"] = "@type", -- built-in types
		["@type.definition"] = { fg = c.magenta }, -- identifiers in type definitions (e.g. `typedef <type> <identifier>` in C)
		--
		["@attribute"] = { fg = c.blue }, -- attribute annotations (e.g. Python decorators, Rust lifetimes)
		["@attribute.builtin"] = "@attribute", -- builtin annotations (e.g. `@property` in Python)
		["@property"] = "Field", -- the key in key/value pairs

		["@function"] = { fg = c.blue }, -- function definitions
		["@function.builtin"] = "@function", -- built-in functions
		["@function.call"] = "@function", -- function calls
		["@function.macro"] = { fg = c.magenta }, -- preprocessor macros

		["@function.method"] = "Field", -- method definitions
		["@function.method.call"] = "@funciton.method", -- method calls

		["@constructor"] = "Constructor", -- constructor calls and definitions
		["@operator"] = "Operator", -- symbolic operators (e.g. `+`, `*`)

		["@keyword"] = "Keyword", -- keywords not fitting into specific categories
		["@keyword.coroutine"] = "@keyword", -- keywords related to coroutines (e.g. `go` in Go, `async/await` in Python)
		["@keyword.function"] = "@keyword", -- keywords that define a function (e.g. `func` in Go, `def` in Python)
		["@keyword.operator"] = { fg = c.cyan }, -- operators that are English words (e.g. `and`, `or`)
		["@keyword.import"] = "@keyword", -- keywords for including modules (e.g. `import`, `from` in Python)
		["@keyword.type"] = "@keyword", -- keywords defining composite types (e.g. `struct`, `enum`)
		["@keyword.modifier"] = "@keyword", -- keywords defining type modifiers (e.g. `const`, `static`, `public`)
		["@keyword.repeat"] = "@keyword", -- keywords related to loops (e.g. `for`, `while`)
		["@keyword.return"] = "@keyword", -- keywords like `return` and `yield`
		["@keyword.debug"] = { fg = c.orange }, -- keywords related to debugging
		["@keyword.exception"] = "@keyword", -- keywords related to exceptions (e.g. `throw`, `catch`)

		["@keyword.conditional"] = "@keyword", -- keywords related to conditionals (e.g. `if`, `else`)
		["@keyword.conditional.ternary"] = "Operator", -- ternary operator (e.g. `?`, `:`)

		["@keyword.directive"] = { fg = c.pink }, -- various preprocessor directives and shebangs
		["@keyword.directive.define"] = { fg = c.pink }, -- preprocessor definition directives

		["@punctuation.delimiter"] = { fg = c.neutral[7] }, -- delimiters (e.g. `;`, `.`, `,`)
		["@punctuation.bracket"] = { fg = c.neutral[7] }, -- brackets (e.g. `()`, `{}`, `[]`)
		["@punctuation.special"] = { fg = c.pink }, -- special symbols (e.g. `{}` in string interpolation)

		["@comment"] = "Comment", -- line and block comments
		["@comment.documentation"] = "Comment", -- comments documenting code

		["@comment.error"] = { fg = c.red }, -- error-type comments (e.g. `ERROR`, `FIXME`, `DEPRECATED`)
		["@comment.warning"] = { fg = c.orange }, -- warning-type comments (e.g. `WARNING`, `FIX`, `HACK`)
		["@comment.todo"] = { fg = c.cyan }, -- todo-type comments (e.g. `TODO`, `WIP`)
		["@comment.note"] = { fg = c.green }, -- note-type comments (e.g. `NOTE`, `INFO`, `XXX`)

		["@markup.strong"] = "Bold", -- bold text
		["@markup.italic"] = "Italic", -- italic text
		-- ["@markup.strikethrough"] = {}, -- struck-through text
		["@markup.underline"] = "Underlined", -- underlined text (only for literal underline markup!)

		["@markup.heading"] = { fg = c.red, bold = true }, -- headings, titles (including markers)
		["@markup.heading.1"] = { fg = c.red, bold = true }, -- top-level heading
		["@markup.heading.2"] = { fg = c.red, bold = true }, -- section heading
		["@markup.heading.3"] = { fg = c.orange, bold = true }, -- subsection heading
		["@markup.heading.4"] = { fg = c.yellow, bold = true }, -- and so on
		["@markup.heading.5"] = { fg = c.green, bold = true }, -- and so forth
		["@markup.heading.6"] = { fg = c.blue, bold = true }, -- six levels ought to be enough for anybody
		--
		-- ["@markup.quote"] = {}, -- block quotes
		-- ["@markup.math"] = {}, -- math environments (e.g. `$ ... $` in LaTeX)
		--
		-- ["@markup.link"] = {}, -- text references, footnotes, citations, etc.
		-- ["@markup.link.label"] = {}, -- link, reference descriptions
		-- ["@markup.link.url"] = {}, -- URL-style links
		--
		-- ["@markup.raw"] = {}, -- literal or verbatim text (e.g. inline code)
		-- ["@markup.raw.block"] = {}, -- literal or verbatim text as a stand-alone block
		--
		-- ["@markup.list"] = {}, -- list markers
		-- ["@markup.list.checked"] = {}, -- checked todo-style list markers
		-- ["@markup.list.unchecked"] = {}, -- unchecked todo-style list markers
		--
		-- ["@diff.plus"] = {}, -- added text (for diff files)
		-- ["@diff.minus"] = {}, -- deleted text (for diff files)
		-- ["@diff.delta"] = {}, -- changed text (for diff files)
		--
		["@tag"] = { fg = c.magenta }, -- XML-style tag names (e.g. in XML, HTML, etc.)
		["@tag.builtin"] = { fg = c.magenta }, -- XML-style tag names (e.g. HTML5 tags)
		["@tag.attribute"] = { fg = c.green }, -- XML-style tag attributes
		["@tag.delimiter"] = { fg = c.neutral[7] }, -- XML-style tag delimiters
	}
end

return M
