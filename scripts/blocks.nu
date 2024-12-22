#!/usr/bin/env nu

export def main [
    columns:number = 6
    rows:number = 1
    --neutrals (-n) # Include black and white colors
    --pattern (-p): closure # Example: {|col, row| $col + $row }
] {
    const r = ansi reset

    const colors = [
        red
        green
        yellow
        blue
        magenta
        cyan
    ]

    const neutral_colors = [
        black
        white
    ]

    const brights = [
        light_red
        light_green
        light_yellow
        light_blue
        light_magenta
        light_cyan
    ]

    const neutral_brights = [
        dark_gray
        light_gray
    ]

    def block [color:int]: nothing -> list<string> {
        let list = if $neutrals {
            $colors | append $neutral_colors
        } else {
            $colors
        }

        let blist = if $neutrals {
            $brights | append $neutral_brights
        } else {
            $brights
        }

        let n = $color mod ($list | length)
        let c = ansi ($list | get $n)
        let b = ansi ($blist | get $n)

        return [
            $"($c)████ ($r)"
            $"($c)████($b)█($r)"
            $"($c)████($b)█($r)"
            $"($b) ▀▀▀▀($r)"
        ]
    }

    def hjoin [block2:list<string>]: list<string> -> list<string> {
        let block1: list<string> = $in

        $block1 | enumerate | each {|it|
            $it.item + "  " + ($block2 | get $it.index)
        }
    }

    def mx []: list<list<number>> -> string {
        let blocks = ($in | default [(seq 0 5)]) | each {|row|
            $row
            | each {|n| (block $n) }
            | reduce {|it, acc| $acc | hjoin $it }
        }

        $"\n($blocks | flatten | each { '  ' + $in } | to text)"
    }

    let p = $pattern | default { $in + 0 }

    seq 0 ($rows - 1)
    | each {|row| seq 0 ($columns - 1) | each { do $p $in $row } }
    | mx
}
