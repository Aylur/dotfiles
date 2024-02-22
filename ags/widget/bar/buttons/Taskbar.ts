import { launchApp, icon } from "lib/utils"
import icons from "lib/icons"
import options from "options"
import PanelButton from "../PanelButton"

const hyprland = await Service.import("hyprland")
const apps = await Service.import("applications")
const { monochrome, exclusive } = options.bar.taskbar
const { position } = options.bar

const focus = (address: string) => hyprland.messageAsync(
    `dispatch focuswindow address:${address}`)

const DummyItem = (address: string) => Widget.Box({
    attribute: { address },
    visible: false,
})

const AppItem = (address: string) => {
    const client = hyprland.getClient(address)
    if (!client || client.class === "")
        return DummyItem(address)

    const app = apps.list.find(app => app.match(client.class))

    const btn = PanelButton({
        class_name: "panel-button",
        tooltip_text: client.title,
        on_primary_click: () => focus(address),
        on_middle_click: () => app && launchApp(app),
        child: Widget.Icon({
            icon: monochrome.bind().as(m => icon(
                (app?.icon_name || client.class) + (m ? "-symbolic" : ""),
                icons.fallback.executable,
            )),
        }),
    })

    return Widget.Box(
        {
            attribute: { address },
            visible: Utils.watch(true, [exclusive, hyprland], () => {
                return exclusive.value
                    ? hyprland.active.workspace.id === client.workspace.id
                    : true
            }),
        },
        Widget.Overlay({
            child: btn,
            pass_through: true,
            overlay: Widget.Box({
                className: "indicator",
                hpack: "center",
                vpack: position.bind().as(p => p === "top" ? "start" : "end"),
                setup: w => w.hook(hyprland, () => {
                    w.toggleClassName("active", hyprland.active.client.address === address)
                }),
            }),
        }),
    )
}

function sortItems<T extends { attribute: { address: string } }>(arr: T[]) {
    return arr.sort(({ attribute: a }, { attribute: b }) => {
        const aclient = hyprland.getClient(a.address)!
        const bclient = hyprland.getClient(b.address)!
        return aclient.workspace.id - bclient.workspace.id
    })
}

export default () => Widget.Box({
    class_name: "taskbar",
    children: sortItems(hyprland.clients.map(c => AppItem(c.address))),
    setup: w => w
        .hook(hyprland, (w, address?: string) => {
            if (typeof address === "string")
                w.children = w.children.filter(ch => ch.attribute.address !== address)
        }, "client-removed")
        .hook(hyprland, (w, address?: string) => {
            if (typeof address === "string")
                w.children = sortItems([...w.children, AppItem(address)])
        }, "client-added")
        .hook(hyprland, (w, event?: string) => {
            if (event === "movewindow")
                w.children = sortItems(w.children)
        }, "event"),
})
