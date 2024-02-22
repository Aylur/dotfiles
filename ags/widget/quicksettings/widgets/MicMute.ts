import { SimpleToggleButton } from "../ToggleButton"
import icons from "lib/icons"
const { microphone } = await Service.import("audio")

const icon = () => microphone.is_muted || microphone.stream?.is_muted
    ? icons.audio.mic.muted
    : icons.audio.mic.high

const label = () => microphone.is_muted || microphone.stream?.is_muted
    ? "Muted"
    : "Unmuted"

export const MicMute = () => SimpleToggleButton({
    icon: Utils.watch(icon(), microphone, icon),
    label: Utils.watch(label(), microphone, label),
    toggle: () => microphone.is_muted = !microphone.is_muted,
    connection: [microphone, () => microphone?.is_muted || false],
})
