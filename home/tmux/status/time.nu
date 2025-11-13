#!/usr/bin/env nu

let hour = date now | into record | get hour
let icon = [ 󱑖 󱑋 󱑌 󱑍 󱑎 󱑏 󱑐 󱑑 󱑒 󱑓 󱑔 󱑕 ] | get ($hour mod 12)
let time = date now | format date "%H:%M"

$"#[fg=#{@main_accent}]($icon) #[bold,fg=default]($time)"
