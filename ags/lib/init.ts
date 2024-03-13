import matugen from "./matugen"
import hyprland from "./hyprland"
import tmux from "./tmux"
import gtk from "./gtk"
import lowBattery from "./battery"
import swww from "./swww"
import notifications from "./notifications"

try {
    gtk()
    tmux()
    matugen()
    lowBattery()
    notifications()
    hyprland()
    swww()
} catch (error) {
    logError(error)
}
