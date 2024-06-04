import GLib from "gi://GLib?version=2.0"
import icons from "lib/icons"
import { bash } from "lib/utils"

const userName = await bash("find /home -maxdepth 1 -printf '%f\n' | tail -n 1")
const iconFile = `/var/lib/AccountsService/icons/${userName}`

// FIXME: AccountsService crashes?
// import AccountsService from "gi://AccountsService?version=1.0"
// const { iconFile, realName, userName } = AccountsService.UserManager
//     .get_default().list_users()[0]

const loggingin = Variable(false)

const CMD = GLib.getenv("ASZTAL_DM_CMD")
    || "Hyprland"

const ENV = GLib.getenv("ASZTAL_DM_ENV")
    || "WLR_NO_HARDWARE_CURSORS=1 _JAVA_AWT_WM_NONREPARENTING=1"

async function login(pw: string) {
    loggingin.value = true
    const greetd = await Service.import("greetd")
    return greetd.login(userName, pw, CMD, ENV.split(/\s+/))
        .catch(res => {
            loggingin.value = false
            response.label = res?.description || JSON.stringify(res)
            password.text = ""
            revealer.reveal_child = true
        })
}

const avatar = Widget.Box({
    class_name: "avatar",
    hpack: "center",
    css: `background-image: url('${iconFile}')`,
})

const password = Widget.Entry({
    placeholder_text: "Password",
    hexpand: true,
    visibility: false,
    on_accept: ({ text }) => { login(text || "") },
})

const response = Widget.Label({
    class_name: "response",
    wrap: true,
    max_width_chars: 35,
    hpack: "center",
    hexpand: true,
    xalign: .5,
})

const revealer = Widget.Revealer({
    transition: "slide_down",
    child: response,
})

export default Widget.Box({
    class_name: "auth",
    attribute: { password },
    vertical: true,
    children: [
        Widget.Overlay({
            child: Widget.Box(
                {
                    css: "min-width: 200px; min-height: 200px;",
                    vertical: true,
                },
                Widget.Box({
                    class_name: "wallpaper",
                    css: `background-image: url('${WALLPAPER}')`,
                }),
                Widget.Box({
                    class_name: "wallpaper-contrast",
                    vexpand: true,
                }),
            ),
            overlay: Widget.Box(
                {
                    vpack: "end",
                    vertical: true,
                },
                avatar,
                Widget.Box({
                    hpack: "center",
                    children: [
                        Widget.Icon(icons.ui.avatar),
                        Widget.Label(userName),
                    ],
                }),
                Widget.Box(
                    {
                        class_name: "password",
                    },
                    Widget.Spinner({
                        visible: loggingin.bind(),
                        active: true,
                    }),
                    Widget.Icon({
                        visible: loggingin.bind().as(b => !b),
                        icon: icons.ui.lock,
                    }),
                    password,
                ),
            ),
        }),
        Widget.Box(
            { class_name: "response-box" },
            revealer,
        ),
    ],
})
