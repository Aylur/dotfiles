# nix build git+ssh://git@github.com/marble-shell/shell

alias "nx switch" = sudo nixos-rebuild switch --flake . --impure
alias "nx test" = sudo nixos-rebuild test --flake . --impure

# Shortcut for "nix-collect-garbage"
def "nx gc" [older_than = "7d"] {
    sudo nix-collect-garbage --delete-older-than $older_than
    nix-collect-garbage --delete-older-than $older_than
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
])

# Push private vault repo to remote
def vault [] {
    cd ~/Vault
    git add .
    git commit -m $"sync (^date '+%Y-%m-%d %H:%M')"
    git push
}
