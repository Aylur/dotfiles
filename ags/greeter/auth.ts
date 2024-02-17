import type Gtk from "gi://Gtk?version=3.0"
import AccountsService from "gi://AccountsService?version=1.0"
import icons from "lib/icons"

const { iconFile, realName, userName } = AccountsService.UserManager.get_default().list_users()[0]

const loggingin = Variable(false)

async function login(password: string) {
    const greetd = await Service.import("greetd")
    return greetd.login(userName, password, "Hyprland", [
        "WLR_NO_HARDWARE_CURSORS=1",
        "_JAVA_AWT_WM_NONREPARENTING=1",
    ])
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
    on_accept: ({ text }) => {
        loggingin.value = true
        login(text!).catch(res => {
            loggingin.value = false
            response.label = res?.description || JSON.stringify(res)
            revealer.reveal_child = true
        })
    },
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

export default Widget.Box<Gtk.Widget>(
    {
        class_name: "auth",
        attribute: { password },
        vertical: true,
    },
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
        overlay: Widget.Box<Gtk.Widget>(
            {
                vpack: "end",
                vertical: true,
            },
            avatar,
            Widget.Label(realName || userName),
            Widget.Box<Gtk.Widget>(
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
)
