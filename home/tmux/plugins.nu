#!/usr/bin/env nu


def plugin [git: string] {
    let name = $git | path split | last
    let dir = $env.HOME | path join .local share tmux $name

    if not ($dir | path exists) {
        git clone $"https://github.com/($git).git" $dir
    }

    tmux run -b (ls $dir | where ($it.name | str ends-with ".tmux") | get 0.name)
}

plugin "christoomey/vim-tmux-navigator"
plugin "tmux-plugins/tmux-yank"
