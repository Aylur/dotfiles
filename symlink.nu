#!/usr/bin/env nu

# this is just so that I don't have to home-manager switch
# when working on these configs

let all = [ags nvim wezterm]

def remove [dir] {
    let target = $"($env.HOME)/.config/($dir)"
    let backup = $"($target).backup"
    rm -rf $target
    rm -rf $backup
    echo $"rm ($target)"
}

def link [dir] {
    let src = $"($env.HOME)/Projects/dotfiles/($dir)"
    let target = $"($env.HOME)/.config/($dir)"
    ln -s $src $target
}

def main [
    ...directories: string
    -r # remove all
    -m # remove mimelist.list
] {
    if $m { rm -f ~/.config/mimeapps.list }
    $all | each {|d| remove $d }
    $directories | each {|d| link $d }
}
