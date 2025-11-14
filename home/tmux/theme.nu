#!/usr/bin/env nu

let dir = $env.CURRENT_FILE | path dirname
def status [name: string] {
    $"($dir)/status/($name).nu"
}

let status_left = [
    "#[fg=#{@main_accent}]"
    "#[noreverse]#{?client_prefix,,}"
    "#[reverse]#{?client_prefix,,}"
    "#[noreverse]#{?client_prefix, ,}"
    "#[fg=black][#[fg=default]#{session_name}#[fg=black]]"
    "#[fg=default] | "
]
| str join

let status_right = match (uname | get operating-system) {
    "Android" => [
        $"($dir)/status/git.nu #{pane_current_path}"
        $"($dir)/status/directory.nu #{pane_current_path}"
    ]
    _ => [
        $"($dir)/status/git.nu #{pane_current_path}"
        $"($dir)/status/directory.nu #{pane_current_path}"
        $"($dir)/status/battery.nu"
        $"($dir)/status/time.nu"
    ]
}
| reduce -f "" {|it, acc| $acc + $"  #\(($it)\)"}

tmux set -g @main_accent                 "blue"
tmux set -g status-right-length          100
tmux set -g pane-active-border           "fg=black"
tmux set -g pane-border-style            "fg=black"
tmux set -g status-style                 "bg=default,fg=default"
tmux set -g status-left                  $status_left
tmux set -g status-right                 $status_right
tmux set -g window-status-current-format "#[bold,fg=#{@main_accent}]#I[#[bold,fg=default]#W#[bold,fg=#{@main_accent}]]"
tmux set -g window-status-format         "#[bold,fg=default]#I#[bold,fg=black][#[nobold,fg=default]#W#[bold,fg=black]]"
tmux set -g window-status-separator      " "
tmux set -g status-position              (if (uname | get operating-system) == "Android" { "top" } else { "bottom" })
