import icons from "lib/icons"
import brightness from "service/brightness"

const BrightnessSlider = () => Widget.Slider({
    draw_value: false,
    hexpand: true,
    value: brightness.bind("screen"),
    on_change: ({ value }) => brightness.screen = value,
})

export const Brightness = () => Widget.Box({
    class_name: "brightness",
    children: [
        Widget.Button({
            vpack: "center",
            child: Widget.Icon(icons.brightness.indicator),
            on_clicked: () => brightness.screen = 0,
            tooltip_text: brightness.bind("screen").as(v =>
                `Screen Brightness: ${Math.floor(v * 100)}%`),
        }),
        BrightnessSlider(),
    ],
})
