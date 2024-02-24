import { Opt } from "lib/option"
import Setter from "./Setter"
import icons from "lib/icons"

export type RowProps<T> = {
    opt: Opt<T>
    title: string
    note?: string
    type?:
    | "number"
    | "color"
    | "float"
    | "object"
    | "string"
    | "enum"
    | "boolean"
    | "img"
    | "font"
    enums?: string[]
    max?: number
    min?: number
}

export default <T>(props: RowProps<T>) => Widget.Box(
    {
        class_name: "row",
        tooltip_text: props.note ? `note: ${props.note}` : "",
    },
    Widget.Box(
        { vertical: true, vpack: "center" },
        Widget.Label({
            xalign: 0,
            class_name: "row-title",
            label: props.title,
        }),
        Widget.Label({
            xalign: 0,
            class_name: "id",
            label: props.opt.id,
        }),
    ),
    Widget.Box({ hexpand: true }),
    Widget.Box(
        { vpack: "center" },
        Setter(props),
    ),
    Widget.Button({
        vpack: "center",
        class_name: "reset",
        child: Widget.Icon(icons.ui.refresh),
        on_clicked: () => props.opt.reset(),
        sensitive: props.opt.bind().as(v => v !== props.opt.initial),
    }),
)
