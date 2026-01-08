#!/usr/bin/env nu

let symlinks = [
    ".git-credentials"
    ".config/git"
    ".config/nushell"
    ".config/nvim"
]

let clean_paths = [
    "/usr/local/bin"
    "/usr/local/sbin"
    "/usr/local/bin"
    "/usr/bin"
    "/usr/sbin"
    "/usr/bin"
    "/sbin"
    "/bin"
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

# Shorthand for `distrobox create` and `distrobox enter`
def main [
    name: string # arbitrary name used to identify the box
    ...exec: string
    --image: string # docker image to use
    --home: string
    --pkgs: string
    --init: string
    --path: string
]: nothing -> nothing {
    let data_dir = $env | get -o XDG_DATA_HOME | default $"($env.HOME)/.local/share"
    let home = $home | default $"($data_dir)/distrobox/($name)"

    if not (box-exists $name) {
        (distrobox create
            --pull
            --yes
            --name $name
            --home $home
            --image $image
            --init-hooks ($init | default "true")
            --additional-packages ($pkgs | default "git")
        )
    }

    for ln in $symlinks {
        let target = $"($home)/($ln)"
        let source = $"($env.HOME)/($ln)"

        if not ($target | path exists) {
            mkdir ($target | path dirname)
            ln -sf $source $target
        }
    }

    let paths = if ($path | describe) == "string" { [...$clean_paths $path] } else { $clean_paths }
    let exe = if ($exec | length) > 0 { $exec } else { [$nu.current-exe] }
    let flags = $"--env PATH=($paths | str join ":")"

    distrobox enter --additional-flags $flags $name -- ...$exe
}
