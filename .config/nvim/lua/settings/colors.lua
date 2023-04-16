require('rose-pine').setup({
  disable_italics = true,
  dark_variant = 'moon',
  groups = { background = '#161616' }
})

require('catppuccin').setup({
  flavour = 'mocha',
  color_overrides = {
    frappe = { base = '#1A1A1A', mantle = '#181818', crust = '#131313' },
    mocha = {
      red = '#e67089',
      green = '#42c383',
      peach = '#d7e77b',
      blue = '#50a4e7',
      mauve = '#9076e7',
      pink = '#e781d6';
      sky = '#50e6e6',

      maroon = '#c35d72',
      teal = '#46a96f',
      yellow = '#c1cf6c',
      lavender = '#448fc6',
      flamingo = '#8860dd',
      rosewater = '#d76dc5';
      sapphire = '#42c3c3',

      text = '#e7e7e7',
      subtext1 = '#dbdbdb',
      subtext2 = '#cacaca',

      overlay2 = '#b2b5b3',
      overlay1 = '#a8aba9',
      overlay0 = '#9ea19f',

      surface2 = '#353331',
      surface1 = '#2f2e2d',
      surface0 = '#2c2a2a',

      base = '#171717',
      mantle = '#111111',
      crust = '#0a0a0a',
    },
  }
})

require('decay').setup({
  style = 'default',
  palette_overrides = {
    background = "#161616",
  }
})
