import icons from "lib/icons"
import { bash, dependencies } from "lib/utils"

const COLORS_CACHE = Utils.CACHE_DIR + "/colorpicker.json"
const MAX_NUM_COLORS = 10

class ColorPicker extends Service {
    static {
        Service.register(this, {}, {
            "colors": ["jsobject"],
        })
    }

    #notifID = 0
    #colors = JSON.parse(Utils.readFile(COLORS_CACHE) || "[]") as string[]

    get colors() { return [...this.#colors] }
    set colors(colors) {
        this.#colors = colors
        this.changed("colors")
    }

    // TODO: doesn't work?
    async wlCopy(color: string) {
        if (dependencies("wl-copy"))
            bash(`wl-copy ${color}`)
    }

    readonly pick = async () => {
        if (!dependencies("hyprpicker"))
            return

        const color = await bash("hyprpicker -a -r")
        if (!color)
            return

        this.wlCopy(color)
        const list = this.colors
        if (!list.includes(color)) {
            list.push(color)
            if (list.length > MAX_NUM_COLORS)
                list.shift()

            this.colors = list
            Utils.writeFile(JSON.stringify(list, null, 2), COLORS_CACHE)
        }

        this.#notifID = await Utils.notify({
            id: this.#notifID,
            iconName: icons.ui.colorpicker,
            summary: color,
        })
    }
}

export default new ColorPicker
