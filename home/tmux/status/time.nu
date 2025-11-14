#!/usr/bin/env nu

def main [format: string = "%H:%M"] {
    let hour = date now | into record | get hour
    let icon = [ 󱑖 󱑋 󱑌 󱑍 󱑎 󱑏 󱑐 󱑑 󱑒 󱑓 󱑔 󱑕 ] | get ($hour mod 12)
    let time = date now | format date $format

    $"#[fg=#{@main_accent}]($icon) #[bold fg=default]($time)"
}

