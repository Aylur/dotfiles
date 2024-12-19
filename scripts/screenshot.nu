#!/usr/bin/env nu

# Dependencies:
# - libnotify: notify-send
# - slurp: slurp
# - wayshot: wayshot
# - swappy: swappy
# - wl-clipbard: wl-copy

let SCREENSHOTS = $"($env.HOME)/Pictures/Screenshots"
let TARGET = $"($SCREENSHOTS)/(date now | format date %Y-%m-%d_%H-%M-%S).png"
let FM = $env.FILE_MANAGER | default "nautilus"

# Simple screenshot script that copies the result into
# clipboard and sends a notification with some actions
def main [
    --full (-f) # Fullscreen
] {
    mkdir $SCREENSHOTS

    if $full {
        wayshot -f $TARGET
    } else {
        wayshot -f $TARGET -s (slurp)
    }

    open $TARGET | wl-copy

    let res = (notify-send
        -a "Screenshot"
        -i "image-x-generic-symbolic"
        -h $"string:image-path:($TARGET)"
        -A "file=Show in Files"
        -A "view=View"
        -A "edit=Edit"
        "Screenshot Taken"
        $TARGET
    )

    match $res {
        "file" => (exec $FM $SCREENSHOTS),
        "view" => (xdg-open $TARGET),
        "edit" => (swappy -f $TARGET),
        _ => exit,
    }
}
