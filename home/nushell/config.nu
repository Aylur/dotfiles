load-env {
    PATH: ([~/.local/bin] | append $env.PATH)
    BROWSER: "firefox"
    TERMINAL: "ghostty"
    VISUAL: "nvim"
    EDITOR: "nvim"
    PAGER: "bat"

    BAT_THEME: "base16"

    GOMODCACHE: ($env.HOME | path join .cache go pkg mod)
    GOPATH: ($env.HOME | path join .local share go)

    NIXPKGS_ALLOW_INSECURE: 1
    NIXPKGS_ALLOW_UNFREE: 1

    QT_XCB_GL_INTEGRATION: "none" # kde-connect

    STARSHIP_SHELL: "nu"
    STARSHIP_CONFIG: ($nu.data-dir | path join starship.toml)
    STARSHIP_SESSION_KEY: (random chars -l 16)

    PROMPT_INDICATOR_VI_INSERT: "  "
    PROMPT_INDICATOR_VI_NORMAL: "∙ "
    PROMPT_MULTILINE_INDICATOR: "┆  "
    PROMPT_COMMAND_RIGHT: ""
    PROMPT_COMMAND: {|| (starship prompt
        --cmd-duration $env.CMD_DURATION_MS
        --status $"($env.LAST_EXIT_CODE)"
        --terminal-width (term size).columns
    )}
}

do {|conf|
    mkdir ($env.STARSHIP_CONFIG | path dirname )
    $conf | to toml | save -f $env.STARSHIP_CONFIG
} {
    add_newline: true
    format: (printf "%s" ...[
        "$nix_shell"
        "$os"
        "$directory"
        "$container"
        "$git_branch $git_status"
        "$python"
        "$nodejs"
        "$lua"
        "$rust"
        "$java"
        "$c"
        "$golang"
        "$cmd_duration"
        "$status"
        "$line_break"
        "[❯](bold purple)"
    ])
    continuation_prompt: "∙  ┆ "
    line_break: {
        disabled: false
    }
    status: {
        symbol: "✗"
        not_found_symbol: "󰍉 Not Found"
        not_executable_symbol: " Can't Execute"
        sigint_symbol: "󰂭 "
        signal_symbol: "󱑽 "
        success_symbol: ""
        format: "[$symbol](fg:red)"
        map_symbol: true
        disabled: false
    }
    cmd_duration: {
        min_time: 1000
        format: "[$duration ](fg:yellow)"
    }
    nix_shell: {
        disabled: false
        format: (printf "%s" ...[
            "[${pad.left}](fg:white)"
            "[ ](bg:white fg:black)"
            "[${pad.right}](fg:white)"
            " "
        ])
    }
    container: {
        symbol: " 󰏖"
        format: "[$symbol ](yellow dimmed)"
    }
    directory: {
        format: (printf "%s" ...[
            " "
            "[](fg:bright-black)"
            "[$path](bg:bright-black fg:white)"
            "[](fg:bright-black)"
            "[$read_only](fg:yellow)"
            " "
        ])
        read_only: " "
        truncate_to_repo: true
        truncation_length: 4
        truncation_symbol: ""
    }
    git_branch: {
        symbol: ""
        style: ""
        format: "[ $symbol $branch](fg:purple)(:$remote_branch)"
    }
    os: {
        disabled: false
        format: "$symbol"
        symbols: {
            Android: "[ ](fg:bright-green)"
            Arch: "[ ](fg:bright-blue)"
            Alpine: "[ ](fg:bright-blue)"
            Debian: "[ ](fg:red))"
            EndeavourOS: "[ ](fg:purple)"
            Fedora: "[ ](fg:blue)"
            NixOS: "[ ](fg:blue)"
            openSUSE: "[ ](fg:green)"
            SUSE: "[ ](fg:green)"
            Ubuntu: "[ ](fg:bright-purple)"
            Macos: "[ ](fg:white)"
        }
    }
    python: { symbol: " " format: "[$symbol](yellow)" }
    nodejs: { symbol: "󰛦 " format: "[$symbol](bright-blue)" }
    bun: { symbol: "󰛦 " format: "[$symbol](blue)" }
    deno: { symbol: "󰛦 " format: "[$symbol](blue)" }
    lua: { symbol: "󰢱 " format: "[$symbol](blue)" }
    rust: { symbol: " " format: "[$symbol](red)" }
    java: { symbol: " " format: "[$symbol](red)" }
    c: { symbol: " " format: "[$symbol](blue)" }
    golang: { symbol: " " format: "[$symbol](blue)" }
    dart: { symbol: " " format: "[$symbol](blue)" }
    elixir: { symbol: " " format: "[$symbol](purple)" }
}

$env.config = {
    show_banner: false
    edit_mode: "vi"
    buffer_editor: "nvim"
    render_right_prompt_on_last_line: true
    cursor_shape: {
        vi_insert: "line"
        vi_normal: "block"
    }
    display_errors: {
        exit_code: false
    }
    rm: {
        always_trash: true
    }
    menus: [
        {
            marker: "? "
            name: "completion_menu"
            only_buffer_difference: false
            style: {
                description_text: "yellow"
                selected_text: "blue_reverse"
                text: "magenta"
            },
            type: {
                col_padding: 2
                columns: 4
                layout: "columnar"
            }
        }
    ]
    table: {
        header_on_separator: false
        index_mode: "always"
        mode: "compact"
    }
}

alias ":q" = exit
alias "db" = distrobox
alias "del" = gio trash
alias "dev" = nix develop -c nu '-c' nvim
alias "ga" = git add
alias "gc" = git commit
alias "gr" = git reset --soft HEAD~1
alias "gs" = git status
alias "l" = ls
alias "ll" = eza -la --sort name --group-directories-first --no-permissions --no-filesize --no-user --no-time
alias "nv" = nvim
alias "q" = exit
alias "tree" = eza --tree
alias "és" = ls
alias "éé" = ls

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

const path = "~/.nushellrc.nu"
const null = "/dev/null"
source (if ($path | path exists) { $path } else { $null })
