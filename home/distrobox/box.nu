#!/use/bin/env nu

let symlinks = [
    ".bashrc"
    ".zshrc"
    ".git-credentials"
    ".config/git"
    ".config/nushell"
    ".config/nvim"
    ".config/nix"
    ".config/starship.toml"
]

def box-exists [box: string]: nothing -> bool {
    distrobox list
    | split row "\n"
    | each { $in | split row "|" | str trim }
    | drop nth 0
    | each { $in | get 1 }
    | where { $in == $box }
    | length
    | do { $in == 1 }
}

# Short hand for "distrobox create" and "distrobox enter"
def main [
    name: string # arbitrary name used to identify the box
    image: string # docker image to use
    ...exec: string
    --home (-h): string
    --pkgs (-p): string = "git"
    --init (-i): string = "true"
]: nothing -> nothing {
    let dir = $home | default $"($env.HOME)/.local/share/distrobox/($name)"

    if not (box-exists $name) {
        (distrobox create
            --pull
            --yes
            --name $name
            --home $dir
            --image $image
            --init-hooks $init
            --additional-packages $pkgs
        )
    }

    for ln in $symlinks {
        let target = $"($dir)/($ln)"
        let source = $"($env.HOME)/($ln)"

        if not ($target | path exists) {
            mkdir ($target | path dirname)
            ln -sf $source $target
        }
    }

    if ($exec | length) > 0 {
        distrobox enter $name -- ...$exec
    } else {
        distrobox enter $name -- bash
    }
}
