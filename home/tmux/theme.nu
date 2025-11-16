#!/usr/bin/env nu

let dir = $env.CURRENT_FILE | path dirname

def status [name: string, ...args: string] {
    printf "#(%s %s)" $"($dir)/status/($name).nu" ($args | str join " ")
}

def strjoin [sep: string, args: list<string>] {
    $args | str join $sep
}

let window_format = strjoin "" [
    "#[bold fg=default]#I"
    "#[fg=black]["
    "#[nobold fg=default]#W"
    "#[bold fg=black]]"
]

let window_current = strjoin "" [
    "#[bold fg=#{@main_accent}]#I["
    "#[nobold fg=default]#W"
    "#[bold fg=#{@main_accent}]]"
]

let status_left = strjoin "" [
    "#[fg=#{@main_accent}]"
    "#[noreverse]#{?client_prefix,,}"
    "#[reverse]#{?client_prefix,,}"
    "#[noreverse]#{?client_prefix, ,}"
    "#[fg=black][#[fg=default]#{session_name}#[fg=black]]"
    "#[fg=default] | "
]

let status_right = strjoin "  " (match (uname | get operating-system) {
    "Android" => [
        (status git "#{pane_current_path}")
        (status directory "#{pane_current_path}")
    ]
    _ => [
        (status git "#{pane_current_path}")
        (status directory "#{pane_current_path}")
        (status battery)
        $"#[bold](status time)"
        # $"#[nobold fg=white align=absolute-centre](status time "'%H:%M - %A %e.'")"
    ]
})

tmux set -g @main_accent                 blue
tmux set -g window-status-current-format $window_current
tmux set -g pane-active-border           fg=black
tmux set -g pane-border-style            fg=black
tmux set -g status-style                 bg=default,fg=default
tmux set -g status-position              bottom
tmux set -g status-right-length          0
tmux set -g status-left                  $status_left
tmux set -g status-right                 $status_right
tmux set -g status-justify               left
tmux set -g window-status-format         $window_format
tmux set -g window-status-current-format $window_current
tmux set -g window-status-separator      " "
