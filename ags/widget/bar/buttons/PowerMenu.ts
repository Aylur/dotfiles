import icons from "lib/icons"
import PanelButton from "../PanelButton"
import options from "options"

const { monochrome, action } = options.bar.powermenu

export default () => PanelButton({
    window: "powermenu",
    on_clicked: action.bind(),
    child: Widget.Icon(icons.powermenu.shutdown),
    setup: self => self.hook(monochrome, () => {
        self.toggleClassName("colored", !monochrome.value)
        self.toggleClassName("box")
    }),
})
