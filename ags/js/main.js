import Applauncher from './applauncher/Applauncher.js';
import Dashboard from './dashboard/Dashboard.js';
import Desktop from './desktop/Desktop.js';
import FloatingDock from './dock/FloatingDock.js';
import Lockscreen from './lockscreen/Lockscreen.js';
import Notifications from './notifications/Notifications.js';
import OSD from './osd/OSD.js';
import Overview from './overview/Overview.js';
import PowerMenu from './powermenu/PowerMenu.js';
import QuickSettings from './quicksettings/QuickSettings.js';
import ScreenCorners from './screencorner/ScreenCorners.js';
import TopBar from './bar/TopBar.js';
import Verification from './powermenu/Verification.js';
import About from './about/about.js';
import { init } from './settings/setup.js';
import { forMonitors } from './utils.js';
import { initWallpaper } from './settings/wallpaper.js';
import options from './options.js';

initWallpaper();

const windows = () => [
    forMonitors(Desktop),
    forMonitors(FloatingDock),
    forMonitors(Lockscreen),
    forMonitors(Notifications),
    forMonitors(OSD),
    forMonitors(ScreenCorners),
    forMonitors(TopBar),
    Applauncher(),
    Dashboard(),
    Overview(),
    PowerMenu(),
    QuickSettings(),
    Verification(),
    About(),
];

export default {
    onConfigParsed: init,
    windows: windows().flat(1),
    maxStreamVolume: 1.05,
    cacheNotificationActions: true,
    closeWindowDelay: {
        'quicksettings': options.transition.value,
        'dashboard': options.transition.value,
    },
};
