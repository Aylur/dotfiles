import RegularWindow from "widget/RegularWindow"
import layout from "./layout"
import icons from "lib/icons"
import options from "options"

const current = Variable(layout[0].attribute.name)

const Header = () => Widget.CenterBox({
    class_name: "header",
    start_widget: Widget.Button({
        class_name: "reset",
        on_clicked: options.reset,
        hpack: "start",
        vpack: "start",
        child: Widget.Icon(icons.ui.refresh),
        tooltip_text: "Reset",
    }),
    center_widget: Widget.Box({
        class_name: "pager horizontal",
        children: layout.map(({ attribute: { name, icon } }) => Widget.Button({
            xalign: 0,
            class_name: current.bind().as(v => `${v === name ? "active" : ""}`),
            on_clicked: () => current.value = name,
            child: Widget.Box([
                Widget.Icon(icon),
                Widget.Label(name),
            ]),
        })),
    }),
    end_widget: Widget.Button({
        class_name: "close",
        hpack: "end",
        vpack: "start",
        child: Widget.Icon(icons.ui.close),
        on_clicked: () => App.closeWindow("settings-dialog"),
    }),
})

const PagesStack = () => Widget.Stack({
    transition: "slide_left_right",
    children: layout.reduce((obj, page) => ({ ...obj, [page.attribute.name]: page }), {}),
    shown: current.bind() as never,
})

export default () => RegularWindow({
    name: "settings-dialog",
    class_name: "settings-dialog",
    title: "Settings",
    setup(win) {
        win.on("delete-event", () => {
            win.hide()
            return true
        })
        win.set_default_size(600, 500)
    },
    child: Widget.Box({
        vertical: true,
        children: [
            Header(),
            PagesStack(),
        ],
    }),
})
