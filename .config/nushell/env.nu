# Nix
let flags = "--extra-experimental-features nix-command --extra-experimental-features flakes"
def "nx run" [pkg] { nu -c $"nix ($flags) run `nixpkgs#($pkg)`" }
def "nx search" [pkg] { nu -c $"nix ($flags) search `nixpkgs#($pkg)`" }
def "nx install" [pkg] { nu -c $"nix profile ($flags) install `nixpkgs#($pkg)`" }
def "nx list" [] { nu -c $"nix profile ($flags) list" }
def "nx up" [] { nu -c $"nix profile ($flags) upgrade '.*'" }

let-env ENV_CONVERSIONS = {
  "PATH": {
    from_string: { |s| $s | split row (char esep) | path expand -n }
    to_string: { |v| $v | path expand -n | str join (char esep) }
  }
}

let-env PATH = ($env.PATH | split row (char esep) | prepend '$env.HOME/.nix-profile/bin')

mkdir ~/.cache/starship
starship init nu | save -f ~/.cache/starship/init.nu
