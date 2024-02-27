import PanelButton from "../PanelButton"
import options from "options"
import { sh, range } from "lib/utils"

const hyprland = await Service.import("hyprland")
const { workspaces, colorMonitors } = options.bar.workspaces

const dispatch = (arg: string | number) => {
    sh(`hyprctl dispatch workspace ${arg}`)
}

const Workspaces = (ws: number) => Widget.Box({
    children: range(ws || 20).map(i => Widget.Label({
        attribute: i,
        vpack: "center",
        label: `${i}`,
        setup: self => self.hook(hyprland, () => {
            const ws = hyprland.getWorkspace(i);

            const monitorClass = (ws?.monitorID === 0) ? 'Primary' : 'Secondary';
            const isActive = hyprland.active.workspace.id === i || ws?.windows > 0;
            const toggleMonitorClass = isActive && colorMonitors.value;
            self.toggleClassName(`monitor${monitorClass}`, toggleMonitorClass);

            self.toggleClassName("active", hyprland.active.workspace.id === i)
            self.toggleClassName("occupied", (ws?.windows || 0) > 0)
        }),
    })),
    setup: box => {
        if (ws === 0) {
            box.hook(hyprland.active.workspace, () => box.children.map(btn => {
                btn.visible = hyprland.workspaces.some(ws => ws.id === btn.attribute)
            }))
        }
    },
})

export default () => PanelButton({
    window: "overview",
    class_name: "workspaces",
    on_scroll_up: () => dispatch("m+1"),
    on_scroll_down: () => dispatch("m-1"),
    on_clicked: () => App.toggleWindow("overview"),
    child: workspaces.bind().as(Workspaces),
})
