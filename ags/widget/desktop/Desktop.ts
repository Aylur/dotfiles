import options from "options"
import { matugen } from "lib/matugen"
const mpris = await Service.import("mpris")

const pref = () => options.bar.media.preferred.value

export default (monitor: number) => Widget.Window({
    monitor,
    layer: "bottom",
    name: `desktop${monitor}`,
    class_name: "desktop",
    anchor: ["top", "bottom", "left", "right"],
    child: Widget.Box({
        expand: true,
        css: options.theme.dark.primary.bg.bind().as(c => `
            transition: 500ms;
            background-color: ${c}`),
        child: Widget.Box({
            class_name: "wallpaper",
            expand: true,
            vpack: "center",
            hpack: "center",
            setup: self => self
                .hook(mpris, () => {
                    const img = mpris.getPlayer(pref())!.cover_path
                    matugen("image", img)
                    Utils.timeout(500, () => self.css = `
                        background-image: url('${img}');
                        background-size: contain;
                        background-repeat: no-repeat;
                        transition: 200ms;
                        min-width: 700px;
                        min-height: 700px;
                        border-radius: 30px;
                        box-shadow: 25px 25px 30px 0 rgba(0,0,0,0.5);`,
                    )
                }),
        }),
    }),
})
