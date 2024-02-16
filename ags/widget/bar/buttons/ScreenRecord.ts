import PanelButton from "../PanelButton"
import screenrecord from "service/screenrecord"
import icons from "lib/icons"

export default () => PanelButton({
    class_name: "recorder",
    on_clicked: () => screenrecord.stop(),
    visible: screenrecord.bind("recording"),
    child: Widget.Box({
        children: [
            Widget.Icon(icons.recorder.recording),
            Widget.Label({
                label: screenrecord.bind("timer").as(time => {
                    const sec = time % 60
                    const min = Math.floor(time / 60)
                    return `${min}:${sec < 10 ? "0" + sec : sec}`
                }),
            }),
        ],
    }),
})
