import { Opt } from "lib/option"
import Setter from "./Setter"
import type Gtk from "gi://Gtk?version=3.0"

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

export default <T>(props: RowProps<T>) => Widget.Box<Gtk.Widget>(
    { class_name: "row" },
    Widget.Box<Gtk.Widget>(
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
)
