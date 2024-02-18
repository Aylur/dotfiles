import options from "options"
import { dependencies, sh } from "./utils"

// this is where the gtk portal sets the wallpaper
const WP = `/home/${Utils.USER}/.config/background`

async function wallpaper() {
    const pos = await sh("hyprctl cursorpos")

    await sh([
        "swww", "img",
        "--transition-type", "grow",
        "--transition-pos", pos.replace(" ", ""),
        options.wallpaper.value,
    ])
}

export default async function init() {
    if (!dependencies("swww"))
        return

    Utils.monitorFile(WP, () => options.wallpaper.setValue(WP))
    options.wallpaper.connect("changed", wallpaper)

    await sh("swww init")
    wallpaper()
}
