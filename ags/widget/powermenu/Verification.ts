import PopupWindow from "widget/PopupWindow"
import powermenu from "service/powermenu"

export default () => PopupWindow({
    name: "verification",
    transition: "crossfade",
    child: Widget.Box({
        class_name: "verification",
        vertical: true,
        children: [
            Widget.Box({
                class_name: "text-box",
                vertical: true,
                children: [
                    Widget.Label({
                        class_name: "title",
                        label: powermenu.bind("title"),
                    }),
                    Widget.Label({
                        class_name: "desc",
                        label: "Are you sure?",
                    }),
                ],
            }),
            Widget.Box({
                class_name: "buttons horizontal",
                vexpand: true,
                vpack: "end",
                homogeneous: true,
                children: [
                    Widget.Button({
                        child: Widget.Label("No"),
                        on_clicked: () => App.toggleWindow("verification"),
                        setup: self => self.hook(App, (_, name: string, visible: boolean) => {
                            if (name === "verification" && visible)
                                self.grab_focus()
                        }),
                    }),
                    Widget.Button({
                        child: Widget.Label("Yes"),
                        on_clicked: powermenu.exec,
                    }),
                ],
            }),
        ],
    }),
})
