import { type MprisPlayer } from "types/service/mpris"
import PanelButton from "../PanelButton"
import options from "options"
import icons from "lib/icons"
import { icon } from "lib/utils"

const mpris = await Service.import("mpris")
const { length, direction, preferred, monochrome } = options.bar.media

const getPlayer = (name = preferred.value) =>
    mpris.getPlayer(name) || mpris.players[0] || null

const Content = (player: MprisPlayer) => {
    const revealer = Widget.Revealer({
        click_through: true,
        visible: length.bind().as(l => l > 0),
        transition: direction.bind().as(d => `slide_${d}` as const),
        setup: self => {
            let current = ""
            self.hook(player, () => {
                if (current === player.track_title)
                    return

                current = player.track_title
                self.reveal_child = true
                Utils.timeout(3000, () => {
                    !self.is_destroyed && (self.reveal_child = false)
                })
            })
        },
        child: Widget.Label({
            truncate: "end",
            max_width_chars: length.bind(),
            label: player.bind("track_title").as(() =>
                `${player.track_artists.join(", ")} - ${player.track_title}`),
        }),
    })

    const playericon = Widget.Icon({
        icon: player.bind("entry").as(entry => {
            const name = `${entry}${monochrome.value ? "-symbolic" : ""}`
            return icon(name, icons.fallback.audio)
        }),
    })

    return Widget.Box({
        attribute: { revealer },
        children: direction.bind().as(d => d === "right"
            ? [playericon, revealer] : [revealer, playericon]),
    })
}

export default () => {
    let player = getPlayer()

    const btn = PanelButton({
        class_name: "media",
        child: Widget.Icon(icons.fallback.audio),
    })

    const update = () => {
        player = getPlayer()
        btn.visible = !!player

        if (!player)
            return

        const content = Content(player)
        const { revealer } = content.attribute
        btn.child = content
        btn.on_primary_click = () => { player.playPause() }
        btn.on_secondary_click = () => { player.playPause() }
        btn.on_scroll_up = () => { player.next() }
        btn.on_scroll_down = () => { player.previous() }
        btn.on_hover = () => { revealer.reveal_child = true }
        btn.on_hover_lost = () => { revealer.reveal_child = false }
    }

    return btn
        .hook(preferred, update)
        .hook(mpris, update, "notify::players")
}
