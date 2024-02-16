import css from "style/style"
import matugen from "./matugen"
import hyprland from "./hyprland"
import tmux from "./tmux"
import gtk from "./gtk"
import lowBattery from "./battery"
import swww from "./swww"

export async function init() {
    try {
        gtk()
        css()
        tmux()
        matugen()
        lowBattery()
        hyprland()
        css()
        swww()
    } catch (error) {
        logError(error)
    }
}
