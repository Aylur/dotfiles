import "lib/session"
import "lib/init"
import options from "options"
import Bar from "widget/bar/Bar"
import Applauncher from "widget/applauncher/Applauncher"
import Overview from "widget/overview/Overview"
import PowerMenu from "widget/powermenu/PowerMenu"
import Verification from "widget/powermenu/Verification"
import NotificationPopups from "widget/notifications/NotificationPopups"
import ScreenCorners from "widget/bar/ScreenCorners"
import OSD from "widget/osd/OSD"
import SettingsDialog from "widget/settings/SettingsDialog"
import { forMonitors } from "lib/utils"
import { setupQuickSettings } from "widget/quicksettings/QuickSettings"
import { setupDateMenu } from "widget/datemenu/DateMenu"
import { init } from "lib/init"

App.config({
    onConfigParsed: () => {
        setupQuickSettings()
        setupDateMenu()
        init()
    },
    closeWindowDelay: {
        "applauncher": options.transition.value,
        "overview": options.transition.value,
        "quicksettings": options.transition.value,
        "datemenu": options.transition.value,
    },
    windows: () => [
        ...forMonitors(Bar),
        ...forMonitors(NotificationPopups),
        ...forMonitors(ScreenCorners),
        ...forMonitors(OSD),
        Applauncher(),
        Overview(),
        PowerMenu(),
        Verification(),
        SettingsDialog(),
    ],
})
