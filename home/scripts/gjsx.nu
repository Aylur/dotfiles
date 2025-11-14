#!/usr/bin/env nu

# Run TypeScript using GJS bundled with esbuild
def --wrapped main [entry: string, ...args: string]: nothing -> nothing {
    let file = $"($env.XDG_RUNTIME_DIR)/(random chars -l 6).js"

    (esbuild
        --bundle $entry
        --outfile=$"($file)"
        --external:gi://*
        --external:resource://*
        --external:system
        --external:gettext
        --external:console
        --format=esm
        --sourcemap=inline
        --supported:decorators=false
        --log-level=warning
    )

    gjs -m $file ...$args
    rm $file
}
