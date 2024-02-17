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
        WP,
    ])
}

export default async function init() {
    if (!dependencies("swww"))
        return

    async function cp() {
        const wp = options.wallpaper.value
        if (wp !== WP) {
            await sh(`rm ${WP}`)
            await sh(`cp ${options.wallpaper.value} ${WP}`)
        }
    }

    Utils.monitorFile(WP, wallpaper)
    options.wallpaper.connect("changed", cp)

    await cp()
    await sh("swww init")
    wallpaper()
}
