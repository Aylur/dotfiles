import { clock } from "lib/variables"
import options from "options"
import icons from "lib/icons"
import BatteryBar from "widget/bar/buttons/BatteryBar"
import PanelButton from "widget/bar/PanelButton"

const { scheme } = options.theme
const { monochrome } = options.bar.powermenu
const { format } = options.bar.date

const poweroff = PanelButton({
    class_name: "powermenu",
    child: Widget.Icon(icons.powermenu.shutdown),
    on_clicked: () => Utils.exec("shutdown now"),
    setup: self => self.hook(monochrome, () => {
        self.toggleClassName("colored", !monochrome.value)
        self.toggleClassName("box")
    }),
})

const date = PanelButton({
    class_name: "date",
    child: Widget.Label({
        label: clock.bind().as(c => c.format(`${format}`)!),
    }),
})

const darkmode = PanelButton({
    class_name: "darkmode",
    child: Widget.Icon({ icon: scheme.bind().as(s => icons.color[s]) }),
    on_clicked: () => scheme.value = scheme.value === "dark" ? "light" : "dark",
})

export default Widget.CenterBox({
    class_name: "bar",
    hexpand: true,
    center_widget: date,
    end_widget: Widget.Box({
        hpack: "end",
        children: [
            darkmode,
            BatteryBar(),
            poweroff,
        ],
    }),
})
