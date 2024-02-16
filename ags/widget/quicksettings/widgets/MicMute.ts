import { SimpleToggleButton } from "../ToggleButton"
import icons from "lib/icons"
const { microphone } = await Service.import("audio")

const icon = () => microphone.is_muted || microphone.stream?.is_muted
    ? icons.audio.mic.muted
    : icons.audio.mic.high

const label = () => microphone.is_muted || microphone.stream?.is_muted
    ? "Muted"
    : "Unmuted"

// TODO: Variable watch option
const ico = Variable(icon())
microphone.connect("changed", () => ico.value = icon())

// TODO: Variable watch option
const lbl = Variable(label())
microphone.connect("changed", () => lbl.value = label())

export const MicMute = () => SimpleToggleButton({
    icon: ico.bind(),
    label: lbl.bind(),
    toggle: () => microphone.is_muted = !microphone.is_muted,
    connection: [microphone, () => microphone?.is_muted || false],
})
