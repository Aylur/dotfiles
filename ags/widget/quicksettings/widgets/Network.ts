import { Menu, ArrowToggleButton } from "../ToggleButton"
import icons from "lib/icons.js"
import { dependencies, sh } from "lib/utils"
import options from "options"
const { wifi } = await Service.import("network")

export const NetworkToggle = () => ArrowToggleButton({
    name: "network",
    icon: wifi.bind("icon_name"),
    label: wifi.bind("ssid").as(ssid => ssid || "Not Connected"),
    connection: [wifi, () => wifi.enabled],
    deactivate: () => wifi.enabled = false,
    activate: () => {
        wifi.enabled = true
        wifi.scan()
    },
})

export const WifiSelection = () => Menu({
    name: "network",
    icon: wifi.bind("icon_name"),
    title: "Wifi Selection",
    content: [
        Widget.Button({
            on_clicked: () => sh(options.quicksettings.networkSettings.value),
            child: Widget.Box({
                children: [
                    Widget.Icon(icons.ui.settings),
                    Widget.Label("Network"),
                ],
            }),
        }),
        Widget.Separator(),
        Widget.Scrollable({
            hscroll: "never",
            vscroll: "automatic",
            setup: self => self.set_size_request(-1, 300), // set minimum width and height
            child: Widget.Box({
                vertical: true,
                setup: self => self.hook(wifi, () => self.children =
                    wifi.access_points
                        .filter((ap, index, self) =>
                            index === self.findIndex(elem => (elem.ssid === ap.ssid)))
                        .map(ap => Widget.Button({
                            on_clicked: () => {
                                if (dependencies("nmcli"))
                                    Utils.execAsync(`nmcli device wifi connect ${ap.bssid}`)
                            },
                            child: Widget.Box({
                                children: [
                                    Widget.Icon(ap.iconName),
                                    Widget.Label(ap.ssid || ""),
                                    Widget.Icon({
                                        icon: icons.ui.tick,
                                        hexpand: true,
                                        hpack: "end",
                                        setup: self => Utils.idle(() => {
                                            if (!self.is_destroyed)
                                                self.visible = ap.active
                                        }),
                                    }),
                                ],
                            }),
                        })),
                ),
            }),
        }),
    ],
})
