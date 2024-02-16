import { icon } from "lib/utils"
import icons from "lib/icons"
import Progress from "./Progress"
import brightness from "service/brightness"
import type Gtk from "gi://Gtk?version=3.0"
import options from "options"

const audio = await Service.import("audio")
const { progress, microphone } = options.osd

const DELAY = 2500

function OnScreenProgress(vertical: boolean) {
    const indicator = Widget.Icon({
        size: 42,
        vpack: "start",
    })
    const progress = Progress({
        vertical,
        width: vertical ? 42 : 300,
        height: vertical ? 300 : 42,
        child: indicator,
    })

    const revealer = Widget.Revealer({
        transition: "slide_left",
        child: progress,
    })

    let count = 0
    function show(value: number, icon: string) {
        revealer.reveal_child = true
        indicator.icon = icon
        progress.setValue(value)
        count++
        Utils.timeout(DELAY, () => {
            count--

            if (count === 0)
                revealer.reveal_child = false
        })
    }

    return revealer
        .hook(brightness, () => show(
            brightness.screen,
            icons.brightness.screen,
        ), "notify::screen")
        .hook(brightness, () => show(
            brightness.kbd,
            icons.brightness.keyboard,
        ), "notify::kbd")
        .hook(audio.speaker, () => show(
            audio.speaker.volume,
            icon(audio.speaker.icon_name || "", icons.audio.type.speaker),
        ), "notify::volume")
}

function MicrophoneMute() {
    const icon = Widget.Icon({
        class_name: "microphone",
    })

    const revealer = Widget.Revealer({
        transition: "slide_up",
        child: icon,
    })

    let count = 0
    let mute = audio.microphone.stream?.is_muted ?? false

    return revealer.hook(audio.microphone, () => Utils.idle(() => {
        if (mute !== audio.microphone.stream?.is_muted) {
            mute = audio.microphone.stream!.is_muted
            icon.icon = icons.audio.mic[mute ? "muted" : "high"]
            revealer.reveal_child = true
            count++

            Utils.timeout(DELAY, () => {
                count--
                if (count === 0)
                    revealer.reveal_child = false
            })
        }
    }))
}

export default (monitor: number) => Widget.Window({
    monitor,
    name: `indicator${monitor}`,
    class_name: "indicator",
    layer: "overlay",
    click_through: true,
    anchor: ["right", "left", "top", "bottom"],
    child: Widget.Box({
        css: "padding: 2px;",
        expand: true,
        child: Widget.Overlay<Gtk.Widget>(
            { child: Widget.Box({ expand: true }) },
            Widget.Box({
                hpack: progress.pack.h.bind(),
                vpack: progress.pack.v.bind(),
                child: progress.vertical.bind().as(OnScreenProgress),
            }),
            Widget.Box({
                hpack: microphone.pack.h.bind(),
                vpack: microphone.pack.v.bind(),
                child: MicrophoneMute(),
            }),
        ),
    }),
})
