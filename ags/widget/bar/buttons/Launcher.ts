import PanelButton from "../PanelButton"
import options from "options"

const { icon, label, action } = options.bar.launcher

export default () => PanelButton({
    window: "launcher",
    on_clicked: action.bind(),
    child: Widget.Box([
        Widget.Icon({
            class_name: icon.colored.bind().as(c => c ? "colored" : ""),
            visible: icon.icon.bind().as(v => !!v),
            icon: icon.icon.bind(),
        }),
        Widget.Label({
            class_name: label.colored.bind().as(c => c ? "colored" : ""),
            visible: label.label.bind().as(v => !!v),
            label: label.label.bind(),
        }),
    ]),
})
