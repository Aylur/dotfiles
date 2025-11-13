#!/usr/bin/env nu

def main [dir: string] {
    let branch = git -C $dir rev-parse --abbrev-ref HEAD | complete
    if ($branch.exit_code) == 0 {
        $"#[fg=magenta] ($branch.stdout | str trim)"
    }
}
