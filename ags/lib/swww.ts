import options from "options"
import { dependencies, sh } from "./utils"
import GLib from "gi://GLib?version=2.0"

async function wallpaper() {
    print("hello?")
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

    // gtk portal
    const wp = `${GLib.get_user_config_dir()}/background`
    Utils.monitorFile(wp, () => options.wallpaper.value = wp)

    options.wallpaper.connect("changed", wallpaper)

    await sh("swww init")
    wallpaper()
}
