import Notification from "widget/notifications/Notification"
import options from "options"
import icons from "lib/icons"

const notifications = await Service.import("notifications")
const notifs = notifications.bind("notifications")

const ClearButton = () => Widget.Button({
    on_clicked: () => {
        const n = notifications.notifications
        const t = options.transition.value / 2
        for (let i = 0; i < n.length; i++)
            Utils.timeout(t * i, () => n[i]?.close())
    },
    sensitive: notifs.as(n => n.length > 0),
    child: Widget.Box({
        children: [
            Widget.Label("Clear "),
            Widget.Icon({
                icon: notifs.as(n => icons.trash[n.length > 0 ? "full" : "empty"]),
            }),
        ],
    }),
})

const Header = () => Widget.Box({
    class_name: "header",
    children: [
        Widget.Label({ label: "Notifications", hexpand: true, xalign: 0 }),
        ClearButton(),
    ],
})

const NotificationList = () => {
    const map: Map<number, ReturnType<typeof Widget.Box>> = new Map
    const box = Widget.Box({
        vertical: true,
        children: notifications.notifications.map(Notification),
        visible: notifs.as(n => n.length > 0),
    })

    function remove(_: unknown, id: number) {
        map.get(id)?.destroy()
        map.delete(id)
    }

    return box
        .hook(notifications, remove, "closed")
        .hook(notifications, (_, id: number) => {
            if (id !== undefined) {
                if (map.has(id))
                    remove(null, id)

                const n = notifications.getNotification(id)!
                const w = Notification(n)
                map.set(id, w)
                box.children = [w, ...box.children]
            }
        }, "notified")
}

const Placeholder = () => Widget.Box({
    class_name: "placeholder",
    vertical: true,
    vpack: "center",
    hpack: "center",
    vexpand: true,
    hexpand: true,
    visible: notifs.as(n => n.length === 0),
    children: [
        Widget.Icon(icons.notifications.silent),
        Widget.Label("Your inbox is empty"),
    ],
})

export default () => Widget.Box({
    class_name: "notifications",
    css: options.notifications.width.bind().as(w => `min-width: ${w}px`),
    vertical: true,
    children: [
        Header(),
        Widget.Scrollable({
            vexpand: true,
            hscroll: "never",
            class_name: "notification-scrollable",
            child: Widget.Box({
                class_name: "notification-list vertical",
                vertical: true,
                children: [
                    NotificationList(),
                    Placeholder(),
                ],
            }),
        }),
    ],
})
