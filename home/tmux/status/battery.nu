#!/usr/bin/env nu

let state = match (uname | get operating-system) {
    "Darwin" => {
        let info = pmset -g batt | lines

        let is_charging = (
            $info
            | first
            | parse "{pre} '{from}'"
            | get 0
            | do { $in.from == "AC Power" }
        )

        let percent = (
            $info
            | last
            | parse "{head}\t{percent}%; {tail}"
            | get 0
            | do { ($in.percent | into int) / 100 }
        )

        { percent:$percent is_charging:$is_charging }
    },
    "GNU/Linux" => {
        let percent = (
            open /sys/class/power_supply/*/capacity
            | match ($in | describe) {
                "string" => $in,
                "list<string>" => ($in | get 0),
                _ => "-1",
            }
            | ($in | into int) / 100
        )

        let is_charging = (
            open /sys/class/power_supply/*/status
            | match ($in | describe) {
                "string" => $in,
                "list<string>" => ($in | get 0),
                _ => "Unknown",
            }
            | str trim
            | do { ($in == "Charging") or ($in == "Full" and $percent == 1) }
        )

        { percent:$percent is_charging:$is_charging }
    },
    "Andorid" => {
        # TODO:
        { percent:0 is_charging:false }
    }
}

let low_threshhold = 25
let percent = $state.percent
let is_charging = $state.is_charging

let icons: list<string> = (
    if $is_charging {
        "󰢜 :󰂆 :󰂇 :󰂈 :󰢝 :󰂉 :󰢞 :󰂊 :󰂋 :󰂅 "
    } else {
        "󱃍 :󰁺 :󰁻 :󰁼 :󰁽 :󰁿 :󰁾 :󰂀 :󰂁 :󰂂 :󰁹 "
    }
    | split row ":"
)

let icon: string = $icons | get (
    ($percent) * (($icons | length) - 1)
    | math floor
)

let icon_fg = (
    if $is_charging {
        "green"
    } else if ($percent * 100) <= ($low_threshhold) {
        "red"
    } else {
        "default"
    }
)

let label = $"($percent * 100 | math floor)%"

let label_fg = (
    if ($percent * 100) <= ($low_threshhold) {
        "red"
    } else {
        "default"
    }
)

$"#[fg=($icon_fg)]($icon)#[fg=($label_fg)]($label)"
