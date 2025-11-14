#!/usr/bin/env nu

let dir = $env.CURRENT_FILE | path dirname

def status [name: string, ...args: string] {
    printf "#(%s %s)" $"($dir)/status/($name).nu" ($args | str join " ")
}

let window_list = do {
    let format = [
        "#[bold fg=default]#I"
        "#[fg=black]["
        "#[nobold fg=default]#W"
        "#[bold fg=black]]"
    ]

    let current = [
        "#[bold fg=#{@main_accent}]#I["
        "#[nobold fg=default]#W"
        "#[bold fg=#{@main_accent}]]"
    ]

    $"#{W:($format | str join) ,($current | str join) }"
}

let status_left = [
    "#[default]"
    "#[fg=#{@main_accent}]"
    "#[noreverse]#{?client_prefix,,}"
    "#[reverse]#{?client_prefix,,}"
    "#[noreverse]#{?client_prefix, ,}"
    "#[fg=black][#[fg=default]#{session_name}#[fg=black]]"
    "#[fg=default] | "
    $window_list
]

let status_right = match (uname | get operating-system) {
    "Android" => [
        "#[default]"
        (status git "#{pane_current_path}")
        (status directory "#{pane_current_path}")
    ]
    _ => [
        "#[default]"
        (status git "#{pane_current_path}")
        (status directory "#{pane_current_path}")
        (status battery)
        (status time)
    ]
}

let status_center = [
    # "#[default fg=white]"
    # (status time "'%H:%M - %A %e.'")
    # "#(date '+%H:%M - %A %e.')"
]

let status_format = [
    $"#[align=left]($status_left | str join)"
    $"#[align=absolute-centre]($status_center | str join)"
    $"#[align=right]($status_right | str join '  ')"
]

tmux set -g status-format                ","
tmux set -g @main_accent                 blue
tmux set -g pane-active-border           fg=black
tmux set -g pane-border-style            fg=black
tmux set -g status-style                 bg=default,fg=default
tmux set -g status-format[0]             $"($status_format | str join "")"
tmux set -g status-position              bottom
