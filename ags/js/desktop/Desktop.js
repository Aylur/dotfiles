import Separator from '../misc/Separator.js';
import Theme from '../services/theme/theme.js';
import PowerMenu from '../services/powermenu.js';
import Clock from '../misc/Clock.js';
import icons from '../icons.js';
const { openWindow } = ags.App;
const { MenuItem, Menu, Box, Label, Icon, EventBox, CenterBox, Window, Widget } = ags.Widget;

const Item = (label, icon, onActivate) => MenuItem({
    onActivate,
    child: Box({
        children: [
            Icon(icon),
            Label({
                label,
                hexpand: true,
                xalign: 0,
            }),
        ],
    }),
});

const Desktop = () => EventBox({
    onSecondaryClick: (_, event) => Menu({
        className: 'desktop-menu',
        children: [
            MenuItem({
                child: Box({
                    children: [
                        Icon(icons.powermenu.shutdown),
                        Label({
                            label: 'System',
                            hexpand: true,
                            xalign: 0,
                        }),
                    ],
                }),
                submenu: Menu({
                    children: [
                        Item('Shutdown', icons.powermenu.shutdown, () => PowerMenu.action('shutdown')),
                        Item('Log Out', icons.powermenu.logout, () => PowerMenu.action('logout')),
                        Item('Reboot', icons.powermenu.reboot, () => PowerMenu.action('reboot')),
                        Item('Sleep', icons.powermenu.sleep, () => PowerMenu.action('reboot')),
                    ],
                }),
            }),
            Item('Applications', icons.apps.apps, () => openWindow('applauncher')),
            Widget({ type: imports.gi.Gtk.SeparatorMenuItem }),
            Item('Settings', icons.settings, Theme.openSettings),
        ],
    }).popup_at_pointer(event),
    onMiddleClick: print,
    child: Box({
        vertical: true,
        vexpand: true,
        hexpand: true,
        connections: [[Theme, box => {
            const [halign = 'center', valign = 'center', offset = 64] =
                Theme.getSetting('desktop_clock')?.split(' ') || [];

            box.halign = imports.gi.Gtk.Align[halign.toUpperCase()];
            box.valign = imports.gi.Gtk.Align[valign.toUpperCase()];
            box.setStyle(`margin: ${Number(offset)}px;`);
        }]],
        children: [
            Box({
                className: 'clock-box-shadow',
                children: [CenterBox({
                    className: 'clock-box',
                    children: [
                        Clock({
                            className: 'clock',
                            halign: 'center',
                            format: '%H',
                        }),
                        Box({
                            className: 'separator-box',
                            vertical: true,
                            hexpand: true,
                            halign: 'center',
                            children: [
                                Separator({ valign: 'center', vexpand: true }),
                                Separator({ valign: 'center', vexpand: true }),
                            ],
                        }),
                        Clock({
                            className: 'clock',
                            halign: 'center',
                            format: '%M',
                        }),
                    ],
                })],
            }),
            Clock({ format: '%B %e. %A', className: 'date' }),
        ],
    }),
});

export default monitor => Window({
    monitor,
    name: `desktop${monitor}`,
    layer: 'background',
    className: 'desktop',
    anchor: ['top', 'bottom', 'left', 'right'],
    child: Desktop(),
});
