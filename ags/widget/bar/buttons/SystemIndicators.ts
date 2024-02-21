import PanelButton from "../PanelButton"
import icons from "lib/icons"
import asusctl from "service/asusctl"

const notifications = await Service.import("notifications")
const bluetooth = await Service.import("bluetooth")
const audio = await Service.import("audio")
const network = await Service.import("network")

const ProfileIndicator = () => Widget.Icon()
    .bind("visible", asusctl, "profile", p => p !== "Balanced")
    .bind("icon", asusctl, "profile", p => icons.asusctl.profile[p])

const ModeIndicator = () => Widget.Icon()
    .bind("visible", asusctl, "mode", m => m !== "Hybrid")
    .bind("icon", asusctl, "mode", m => icons.asusctl.mode[m])

const MicrophoneIndicator = () => Widget.Icon()
    .hook(audio, self => self.visible =
        audio.recorders.length > 0
        || audio.microphone.stream?.is_muted
        || audio.microphone.is_muted)
    .hook(audio.microphone, self => {
        const vol = audio.microphone.stream!.is_muted ? 0 : audio.microphone.volume
        const { muted, low, medium, high } = icons.audio.mic
        const cons = [[67, high], [34, medium], [1, low], [0, muted]] as const
        self.icon = cons.find(([n]) => n <= vol * 100)?.[1] || ""
    })

const DNDIndicator = () => Widget.Icon({
    visible: notifications.bind("dnd"),
    icon: icons.notifications.silent,
})

const BluetoothIndicator = () => Widget.Overlay({
    class_name: "bluetooth",
    passThrough: true,
    child: Widget.Icon({
        icon: icons.bluetooth.enabled,
        visible: bluetooth.bind("enabled"),
    }),
    overlay: Widget.Label({
        hpack: "end",
        vpack: "start",
        label: bluetooth.bind("connected_devices").as(c => `${c.length}`),
        visible: bluetooth.bind("connected_devices").as(c => c.length > 0),
    }),
})

const NetworkIndicator = () => Widget.Icon().hook(network, self => {
    const icon = network[network.primary || "wifi"]?.icon_name
    self.icon = icon || ""
    self.visible = !!icon
})

const AudioIndicator = () => Widget.Icon({
    icon: audio.speaker.bind("volume").as(vol => {
        const { muted, low, medium, high, overamplified } = icons.audio.volume
        const cons = [[101, overamplified], [67, high], [34, medium], [1, low], [0, muted]] as const
        const icon = cons.find(([n]) => n <= vol * 100)?.[1] || ""
        return audio.speaker.is_muted ? muted : icon
    }),
})

export default () => PanelButton({
    window: "quicksettings",
    on_clicked: () => App.toggleWindow("quicksettings"),
    on_scroll_up: () => audio.speaker.volume += 0.02,
    on_scroll_down: () => audio.speaker.volume -= 0.02,
    child: Widget.Box([
        // @ts-expect-error
        asusctl?.available && ProfileIndicator(),
        // @ts-expect-error
        asusctl?.available && ModeIndicator(),
        DNDIndicator(),
        BluetoothIndicator(),
        NetworkIndicator(),
        AudioIndicator(),
        MicrophoneIndicator(),
    ]),
})
