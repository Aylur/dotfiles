import Row from "./Row"

export default <T>(title: string, ...rows: ReturnType<typeof Row<T>>[]) => Widget.Box({
    class_name: "group",
    vertical: true,
    children: [
        Widget.Label({
            hpack: "start",
            class_name: "group-title",
            label: title,
            setup: w => Utils.idle(() => w.visible = !!title),
        }),
        Widget.Box({
            vertical: true,
            children: rows,
        }),
    ],
})
