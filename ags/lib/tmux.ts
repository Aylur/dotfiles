import options from "options"
import { sh } from "./utils"

export async function tmux() {
    const { scheme, dark, light } = options.theme
    const hex = scheme.value === "dark" ? dark.primary.bg.value : light.primary.bg.value
    if (await sh("which tmux"))
        sh(`tmux set @main_accent "${hex}"`)
}

export default function init() {
    options.wallpaper.connect("changed", tmux)
    options.autotheme.connect("changed", tmux)
}
