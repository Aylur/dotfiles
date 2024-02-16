import { type Application } from "types/service/applications"
import options from "options"
import { launchApp, icon } from "lib/utils"
import icons from "lib/icons"

const { iconSize } = options.applauncher

export const QuickButton = (app: Application) => Widget.Button({
    hexpand: true,
    on_clicked: () => {
        App.closeWindow("applauncher")
        launchApp(app)
    },
    child: Widget.Icon({
        size: iconSize.bind(),
        icon: icon(app.icon_name, icons.fallback.executable),
    }),
})

export const AppItem = (app: Application) => {
    const title = Widget.Label({
        class_name: "title",
        label: app.name,
        hexpand: true,
        xalign: 0,
        vpack: "center",
        truncate: "end",
    })

    const description = Widget.Label({
        class_name: "description",
        label: app.description || "",
        hexpand: true,
        wrap: true,
        max_width_chars: 30,
        xalign: 0,
        justification: "left",
        vpack: "center",
    })

    const appicon = Widget.Icon({
        icon: icon(app.icon_name, icons.fallback.executable),
        size: iconSize.bind(),
    })

    const textBox = Widget.Box({
        vertical: true,
        vpack: "center",
        children: app.description ? [title, description] : [title],
    })

    return Widget.Button({
        class_name: "app-item",
        attribute: { app },
        child: Widget.Box({
            children: [appicon, textBox],
        }),
        on_clicked: () => {
            App.closeWindow("applauncher")
            launchApp(app)
        },
    })
}
