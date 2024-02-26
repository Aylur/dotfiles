import PopupWindow from "widget/PopupWindow"
import Workspace from "./Workspace"
import options from "options"
import { range } from "lib/utils"

const hyprland = await Service.import("hyprland")

const Overview = (ws: number) => Widget.Box({
    class_name: "overview horizontal",
    children: ws > 0
        ? range(ws).map(Workspace)
        : hyprland.workspaces
            .map(({ id }) => Workspace(id))
            .sort((a, b) => a.attribute.id - b.attribute.id),

    setup: w => {
        if (ws > 0)
            return

        w.hook(hyprland, (w, id?: string) => {
            if (id === undefined)
                return

            w.children = w.children
                .filter(ch => ch.attribute.id !== Number(id))
        }, "workspace-removed")
        w.hook(hyprland, (w, id?: string) => {
            if (id === undefined)
                return

            w.children = [...w.children, Workspace(Number(id))]
                .sort((a, b) => a.attribute.id - b.attribute.id)
        }, "workspace-added")
    },
})

export default () => PopupWindow({
    name: "overview",
    layout: "center",
    child: options.overview.workspaces.bind().as(Overview),
})
