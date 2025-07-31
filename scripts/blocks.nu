#!/usr/bin/env nu

export def blocks [
    columns:number = 6
    rows:number = 1
    --neutrals (-n) # Include black and white colors
    --pattern (-p): closure # Example: {|x, y| $x + $y }
]: [
    list<int> -> string
    list<list<int>> -> string
    nothing -> string
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
        if $color < 0 {
            return [
                "     "
                "     "
                "     "
                "     "
            ]

        }

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

    let input = $in
    let p = $pattern | default { $in + 0 }
    let mx = if ($input | describe) == "list<int>" {
        [$input]
    } else {
        $input | default []
    }

    let res = if ($mx | length) > 0 {
        $mx
        | each {
            $in
            | enumerate
            | each {|row|
                $row.item
                | each {|col| do $p $col $row.index}
            }
        }
    } else {
        seq 0 ($rows - 1)
        | each {|row|
            seq 0 ($columns - 1)
            | each { do $p $in $row }
        }
    }

    let blocks = $res | each {|row|
        $row
        | each {|n| (block $n) }
        | reduce {|it, acc| $acc | hjoin $it }
    }

    $"\n($blocks | flatten | each { '  ' + $in } | to text)"
}
