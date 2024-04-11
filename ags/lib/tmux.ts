import options from "options"
import { sh } from "./utils"

export async function tmux() {
    const { scheme, dark, light } = options.theme
    const hex = scheme.value === "dark" ? dark.primary.bg.value : light.primary.bg.value
    if (await sh("which tmux").catch(() => false))
        sh(`tmux set @main_accent "${hex}"`)
}

export default function init() {
    options.theme.dark.primary.bg.connect("changed", tmux)
    options.theme.light.primary.bg.connect("changed", tmux)
}
