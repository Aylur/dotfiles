import Gio from "gi://Gio"
import options from "options"

const settings = new Gio.Settings({
    schema: "org.gnome.desktop.interface",
})

function gtk() {
    const scheme = options.theme.scheme.value
    settings.set_string("color-scheme", `prefer-${scheme}`)
}

export default function init() {
    options.theme.scheme.connect("changed", gtk)
    gtk()
}
