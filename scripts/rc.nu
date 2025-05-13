# nix build git+ssh://git@github.com/marble-shell/shell

alias "nx switch" = sudo nixos-rebuild switch --flake . --impure
alias "nx test" = sudo nixos-rebuild test --flake . --impure
alias "nx boot" = sudo nixos-rebuild boot --flake . --impure

# Shortcut for "nix-collect-garbage"
def "nx gc" [older_than = "7d"] {
    sudo nix-collect-garbage -d --delete-older-than $older_than
    nix-collect-garbage -d --delete-older-than $older_than
}

# Shortcut for "home-manager switch"
def "nx hm" [] {
    home-manager switch --flake . -b backup
}

# Shortcut for "nix run"
def "nx run" [pkg: string] {
    let name = do {
        if ($pkg | str starts-with "github:") {
            return $pkg
        }
        if ($pkg | str starts-with ".") {
            return $pkg
        }
        if ($pkg | str starts-with "/") {
            return $pkg
        }
        if ($pkg | str contains "#") {
            return $pkg
        }
        $"nixpkgs#($pkg)"
    }
    nix run $name
}

# Shortcut for "nix search"
def "nx search" [name: string] {
    nix search nixpkgs $name --json
    | from json
    | transpose
    | get column0
    | each {
        $in
        | split row "."
        | reverse
        | drop 2
        | reverse
        | str join "."
    }
}

# Shortcut for "nix shell"
def nx [...packages: string] {
    let pkgs = $packages | each {|pkg|
        if ($pkg | str starts-with "github:") {
            return $pkg
        }
        if ($pkg | str starts-with ".") {
            return $pkg
        }
        if ($pkg | str starts-with "/") {
            return $pkg
        }
        if ($pkg | str contains "#") {
            return $pkg
        }

        $"nixpkgs#($pkg)"
    }

    echo $pkgs
    nix shell ...$pkgs
}

# Enter into a nix shell that contains programs needed for developing JavaScript
alias jsh = nx ...([
    nodejs
    deno
    bun
    yarn
    pnpm
    tailwindcss-language-server
    svelte-language-server
    astro-language-server
    vue-language-server
    vscode-langservers-extracted
    vtsls
    markdownlint-cli2
])

# Enter into a nix shell that contains programs needed for developing Vala
alias vsh = nx ...([
    vala-language-server
    mesonlsp
    blueprint-compiler
    meson
    pkg-config
    ninja
])

# Enter into a nix shell that contains programs needed for developing Elixir
alias esh = nx ...([
    elixir
    elixir-ls
])

# Push private vault repo to remote
def vault [] {
    cd ~/Vault
    git add .
    git commit -m $"sync (^date '+%Y-%m-%d %H:%M')"
    git push
}

def coredump [] {
    # ulimit -c unlimited
    nix shell nixpkgs#gdb -c coredumpctl gdb -1
}
