import { bash, dependencies, sh } from "lib/utils"

if (!dependencies("brightnessctl"))
    App.quit()

const get = (args: string) => Number(Utils.exec(`brightnessctl ${args}`))
const screen = await bash`ls -w1 /sys/class/backlight | head -1`
const kbd = await bash`ls -w1 /sys/class/leds | head -1`

class Brightness extends Service {
    static {
        Service.register(this, {}, {
            "screen": ["float", "rw"],
            "kbd": ["int", "rw"],
        })
    }

    #kbdMax = get(`--device ${kbd} max`)
    #kbd = get(`--device ${kbd} get`)
    #screenMax = get("max")
    #screen = get("get") / (get("max") || 1)

    get kbd() { return this.#kbd }
    get screen() { return this.#screen }

    set kbd(value) {
        if (value < 0 || value > this.#kbdMax)
            return

        sh(`brightnessctl -d ${kbd} s ${value} -q`).then(() => {
            this.#kbd = value
            this.changed("kbd")
        })
    }

    set screen(percent) {
        if (percent < 0)
            percent = 0

        if (percent > 1)
            percent = 1

        sh(`brightnessctl set ${Math.floor(percent * 100)}% -q`).then(() => {
            this.#screen = percent
            this.changed("screen")
        })
    }

    constructor() {
        super()

        const screenPath = `/sys/class/backlight/${screen}/brightness`
        const kbdPath = `/sys/class/leds/${kbd}/brightness`

        Utils.monitorFile(screenPath, async f => {
            const v = await Utils.readFileAsync(f)
            this.#screen = Number(v) / this.#screenMax
            this.changed("screen")
        })

        Utils.monitorFile(kbdPath, async f => {
            const v = await Utils.readFileAsync(f)
            this.#kbd = Number(v) / this.#kbdMax
            this.changed("kbd")
        })
    }
}

export default new Brightness
