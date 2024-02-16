import { type Props as IconProps } from "types/widgets/icon"
import { type Props as LabelProps } from "types/widgets/label"
import type GObject from "gi://GObject?version=2.0"
import type Gtk from "gi://Gtk?version=3.0"
import icons from "lib/icons"

export const opened = Variable("")
App.connect("window-toggled", (_, name: string, visible: boolean) => {
    if (name === "quicksettings" && !visible)
        Utils.timeout(500, () => opened.value = "")
})

export const Arrow = (name: string, activate?: false | (() => void)) => {
    let deg = 0
    let iconOpened = false
    const icon = Widget.Icon(icons.ui.arrow.right).hook(opened, () => {
        if (opened.value === name && !iconOpened || opened.value !== name && iconOpened) {
            const step = opened.value === name ? 10 : -10
            iconOpened = !iconOpened
            for (let i = 0; i < 9; ++i) {
                Utils.timeout(15 * i, () => {
                    deg += step
                    icon.setCss(`-gtk-icon-transform: rotate(${deg}deg);`)
                })
            }
        }
    })
    return Widget.Button({
        child: icon,
        class_name: "arrow",
        on_clicked: () => {
            opened.value = opened.value === name ? "" : name
            if (typeof activate === "function")
                activate()
        },
    })
}

type ArrowToggleButtonProps = {
    name: string
    icon: IconProps["icon"]
    label: LabelProps["label"]
    activate: () => void
    deactivate: () => void
    activateOnArrow?: boolean
    connection: [GObject.Object, () => boolean]
}
export const ArrowToggleButton = ({
    name,
    icon,
    label,
    activate,
    deactivate,
    activateOnArrow = true,
    connection: [service, condition],
}: ArrowToggleButtonProps) => Widget.Box({
    class_name: "toggle-button",
    setup: self => self.hook(service, () => {
        self.toggleClassName("active", condition())
    }),
    children: [
        Widget.Button({
            child: Widget.Box({
                hexpand: true,
                children: [
                    Widget.Icon({
                        class_name: "icon",
                        icon,
                    }),
                    Widget.Label({
                        class_name: "label",
                        max_width_chars: 10,
                        truncate: "end",
                        label,
                    }),
                ],
            }),
            on_clicked: () => {
                if (condition()) {
                    deactivate()
                    if (opened.value === name)
                        opened.value = ""
                } else {
                    activate()
                }
            },
        }),
        Arrow(name, activateOnArrow && activate),
    ],
})

type MenuProps = {
    name: string
    icon: IconProps["icon"]
    title: LabelProps["label"]
    content: Gtk.Widget[]
}
export const Menu = ({ name, icon, title, content }: MenuProps) => Widget.Revealer({
    transition: "slide_down",
    reveal_child: opened.bind().as(v => v === name),
    child: Widget.Box({
        class_names: ["menu", name],
        vertical: true,
        children: [
            Widget.Box({
                class_name: "title-box",
                children: [
                    Widget.Icon({
                        class_name: "icon",
                        icon,
                    }),
                    Widget.Label({
                        class_name: "title",
                        truncate: "end",
                        label: title,
                    }),
                ],
            }),
            Widget.Separator(),
            Widget.Box({
                vertical: true,
                class_name: "content vertical",
                children: content,
            }),
        ],
    }),
})

type SimpleToggleButtonProps = {
    icon: IconProps["icon"]
    label: LabelProps["label"]
    toggle: () => void
    connection: [GObject.Object, () => boolean]
}
export const SimpleToggleButton = ({
    icon,
    label,
    toggle,
    connection: [service, condition],
}: SimpleToggleButtonProps) => Widget.Button({
    on_clicked: toggle,
    class_name: "simple-toggle",
    setup: self => self.hook(service, () => {
        self.toggleClassName("active", condition())
    }),
    child: Widget.Box([
        Widget.Icon({ icon }),
        Widget.Label({
            max_width_chars: 10,
            truncate: "end",
            label,
        }),
    ]),
})
