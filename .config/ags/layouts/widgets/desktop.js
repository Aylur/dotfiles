import { Clock } from '../../modules/clock.js';
import { Separator } from '../../modules/misc.js';
const { Theme, System } = ags.Service;
const { MenuItem, Menu, Box, Label, Icon, EventBox, CenterBox } = ags.Widget;

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

export const Desktop = props => EventBox({
    ...props,
    onSecondaryClick: (_, event) => Menu({
        className: 'desktop',
        children: [
            MenuItem({
                child: Box({
                    children: [
                        Icon('system-shutdown-symbolic'),
                        Label({
                            label: 'System',
                            hexpand: true,
                            xalign: 0,
                        }),
                    ],
                }),
                submenu: Menu({
                    children: [
                        Item('Shutdown', 'system-shutdown-symbolic', () => System.action('Shutdown')),
                        Item('Log Out', 'system-log-out-symbolic', () => System.action('Log Out')),
                        Item('Reboot', 'system-reboot-symbolic', () => System.action('Log Out')),
                        Item('Sleep', 'weather-clear-night-symbolic', () => System.action('Log Out')),
                    ],
                }),
            }),
            MenuItem({ className: 'separator' }),
            Item('Settings', 'org.gnome.Settings-symbolic', Theme.openSettings),
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
