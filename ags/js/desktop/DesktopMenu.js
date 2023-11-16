import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import PowerMenu from '../services/powermenu.js';
import icons from '../icons.js';
import Gtk from 'gi://Gtk';
import { openSettings } from '../settings/theme.js';

/**
 * @param {string} label
 * @param {string} icon
 * @param {import('types/widgets/menu').MenuItemProps['on_activate']} on_activate
 */
const Item = (label, icon, on_activate) => Widget.MenuItem({
    on_activate,
    child: Widget.Box({
        children: [
            Widget.Icon(icon),
            Widget.Label({
                label,
                hexpand: true,
                xalign: 0,
            }),
        ],
    }),
});

export default () => Widget.Menu({
    class_name: 'desktop-menu',
    children: [
        Widget.MenuItem({
            child: Widget.Box({
                children: [
                    Widget.Icon(icons.powermenu.shutdown),
                    Widget.Label({
                        label: 'System',
                        hexpand: true,
                        xalign: 0,
                    }),
                ],
            }),
            submenu: Widget.Menu({
                children: [
                    Item('Shutdown', icons.powermenu.shutdown, () => PowerMenu.action('shutdown')),
                    Item('Log Out', icons.powermenu.logout, () => PowerMenu.action('logout')),
                    Item('Reboot', icons.powermenu.reboot, () => PowerMenu.action('reboot')),
                    Item('Sleep', icons.powermenu.sleep, () => PowerMenu.action('reboot')),
                ],
            }),
        }),
        Item('Applications', icons.apps.apps, () => App.openWindow('applauncher')),
        new Gtk.SeparatorMenuItem,
        Item('Settings', icons.ui.settings, openSettings),
    ],
});
