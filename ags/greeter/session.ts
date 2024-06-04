import GLib from "gi://GLib?version=2.0"
import { bash } from "lib/utils"

// import AccountsService from "gi://AccountsService?version=1.0"
// const { userName } = AccountsService.UserManager.get_default().list_users()[0]

const userName = await bash("find /home -maxdepth 1 -printf '%f\n' | tail -n 1")

declare global {
    const WALLPAPER: string
}

Object.assign(globalThis, {
    TMP: `${GLib.get_tmp_dir()}/greeter`,
    OPTIONS: "/var/cache/greeter/options.json",
    WALLPAPER: "/var/cache/greeter/background",
    // TMP: "/tmp/ags",
    // OPTIONS: Utils.CACHE_DIR + "/options.json",
    // WALLPAPER: Utils.HOME + "/.config/background",
    USER: userName,
})

Utils.ensureDirectory(TMP)
