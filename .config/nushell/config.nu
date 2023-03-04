# Distrobox
alias db = distrobox
alias arch = distrobox-enter Arch
alias fedora = distrobox-enter Fedora

# Flatpaks
alias code = flatpak run com.visualstudio.code
alias firefox = flatpak run org.mozilla.firefox

# Rust utils
alias cat = bat

# Envs
let-env EDITOR = 'nvim'
let-env SHELL = $env.HOME + '/.nix-profile/bin/nu'

# The default config record. This is where much of your global configuration is setup.
let-env config = {
  table: {
    mode: rounded # basic, compact, compact_double, light, thin, with_love, rounded, reinforced, heavy, none, other
    index_mode: auto # "always" show indexes, "never" show indexes, "auto" = show indexes when a table has "index" column
  }

  history: {
    max_size: 100 # Session has to be reloaded for this to take effect
  }

  show_banner: false # true or false to enable or disable the banner
}

source ~/.cache/starship/init.nu
neofetch
