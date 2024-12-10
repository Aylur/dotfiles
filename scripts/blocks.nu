#!/usr/bin/env nu

let r = ansi reset

let colors = [
    red
    green
    yellow
    blue
    magenta
    cyan
    black
    white
]

let brights = [
    light_red
    light_green
    light_yellow
    light_blue
    light_magenta
    light_cyan
    dark_gray
    light_gray
]

def block [color: int]: nothing -> list<string> {
    let c = ansi ($colors | get $color)
    let b = ansi ($brights | get $color)

    return [
        $"($c)████ ($r)"
        $"($c)████($b)█($r)"
        $"($c)████($b)█($r)"
        $"($b) ▀▀▀▀($r)"
    ]
}

def hjoin [block2: list<string>]: list<string> -> list<string> {
    let block1: list<string> = $in

    $block1 | enumerate | each {|it|
        $it.item + "  " + ($block2 | get $it.index)
    }
}

def main [pattern: string = "6"] {
    let layout = match $pattern {
        "8" => [(seq 0 7)],
        "1x8" => [(seq 0 7)],
        "4" => [(seq 0 3) (seq 4 7)],
        "2x4" => [(seq 0 3) (seq 4 7)],
        _ => [(seq 0 5)],
    }

    let blocks = $layout | each {|row|
        $row
        | each { (block $in) }
        | reduce {|it, acc| $acc | hjoin $it }
    }

    let str = $blocks | flatten | each { "  " + $in } | to text
    $"\n($str)"
}
