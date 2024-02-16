import { Opt } from "lib/option"
import icons from "lib/icons"
import Gtk from "types/@girs/gtk-3.0/gtk-3.0"
import Gdk from "gi://Gdk"

function EnumSetter(opt: Opt<string>, values: string[]) {
    const lbl = Widget.Label({ label: opt.bind().as(v => `${v}`) })
    const step = (dir: 1 | -1) => {
        const i = values.findIndex(i => i === lbl.label)
        opt.setValue(dir > 0
            ? i + dir > values.length - 1 ? values[0] : values[i + dir]
            : i + dir < 0 ? values[values.length - 1] : values[i + dir],
        )
    }
    const next = Widget.Button({
        child: Widget.Icon(icons.ui.arrow.right),
        on_clicked: () => step(+1),
    })
    const prev = Widget.Button({
        child: Widget.Icon(icons.ui.arrow.left),
        on_clicked: () => step(-1),
    })
    return Widget.Box({
        class_name: "enum-setter",
        children: [lbl, prev, next],
    })
}

type RowProps<T> = {
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

function Setter<T>({
    opt,
    type = typeof opt.value as RowProps<T>["type"],
    enums,
    max = 1000,
    min = 0,
}: RowProps<T>) {
    switch (type) {
        case "number": return Widget.SpinButton({
            setup(self) {
                self.set_range(min, max)
                self.set_increments(1, 5)
                self.on("value-changed", () => opt.value = self.value as T)
                self.hook(opt, () => self.value = opt.value as number)
            },
        })
        case "float":
        case "object": return Widget.Entry({
            on_accept: self => opt.value = JSON.parse(self.text || ""),
            setup: self => self.hook(opt, () => self.text = JSON.stringify(opt.value)),
        })
        case "string": return Widget.Entry({
            on_accept: self => opt.value = self.text as T,
            setup: self => self.hook(opt, () => self.text = opt.value as string),
        })
        case "enum": return EnumSetter(opt as unknown as Opt<string>, enums!)
        case "boolean": return Widget.Switch()
            .on("notify::active", self => opt.value = self.active as T)
            .hook(opt, self => self.active = opt.value as boolean)

        case "img": return Widget.FileChooserButton()
            .on("selection-changed", self => {
                opt.value = self.get_uri()?.replace("file://", "") as T
            })

        case "font": return Widget.FontButton({
            show_size: false,
            use_size: false,
            setup: self => self
                .on("notify::font", ({ font }) => opt.value = font as T)
                .hook(opt, () => self.font = opt.value as string),
        })
        case "color": return Widget.ColorButton({
            setup: self => self
                .hook(opt, () => {
                    const rgba = new Gdk.RGBA()
                    rgba.parse(opt.value as string)
                    self.rgba = rgba
                })
                .on("color-set", ({ rgba: { red, green, blue } }) => {
                    const hex = (n: number) => {
                        const c = Math.floor(255 * n).toString(16)
                        return c.length === 1 ? `0${c}` : c
                    }
                    opt.value = `#${hex(red)}${hex(green)}${hex(blue)}` as T
                }),
        })
        default: return Widget.Label({
            label: `no setter with type ${type}`,
        })
    }
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
