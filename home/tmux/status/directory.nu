#!/usr/bin/env nu

def omit [n: number]: string -> string {
    $in | path split | slice $n.. | path join
}

def main [dir: string] {
    let path = if ($dir | str starts-with $env.HOME) {
        $dir | omit 3
    } else {
        $dir
    }

    let display = match ($path | path split | get -i 0) {
        "Projects" => [" 󰊢 ", ($path | omit 1)],
        "Work" => ["  ", ($path | omit 1)],
        "Desktop" => ["  ", ($path | omit 1)]
        "Downloads" => ["  ", ($path | omit 1)]
        "Documents" => ["  ", ($path | omit 1)]
        "Vault" => [" 󱉼 ", ($path | omit 1)]
        "Pictures" => ["  ", ($path | omit 1)]
        "Music" => ["  ", ($path | omit 1)]
        "Videos" => ["  ", ($path | omit 1)]
        "Games" => ["  ", ($path | omit 1)]
        "Public" => ["  ", ($path | omit 1)]
        ".config" => ["  ", ($path | omit 1)],
        null => ["  "],
        _ => [],
    }

    let icon = $display | get -i 0 | default " "
    let label = $display | get -i 1 | default $path

    $"#[fg=#{@main_accent}]($icon)#[fg=default]($label)"
}
