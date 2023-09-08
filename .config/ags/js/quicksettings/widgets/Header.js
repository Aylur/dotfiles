import icons from '../../icons.js';
import PowerMenu from '../../services/powermenu.js';
import Theme from '../../services/theme/theme.js';
import { uptime } from '../../variables.js';
const { Battery } = ags.Service;
const { Box, Label, Button, Icon, Overlay, ProgressBar } = ags.Widget;

const Avatar = () => Box({
    className: 'avatar',
    halign: 'start',
    hexpand: false,
    connections: [[Theme, box => {
        box.setStyle(`
            background-image: url('${Theme.getSetting('avatar')}');
            background-size: cover;
        `);
    }]],
    children: [
        Box({
            className: 'shader',
            vexpand: true,
            hexpand: true,
        }),
    ],
});

export const BatteryProgress = () => Box({
    className: 'battery-progress',
    vexpand: true,
    connections: [[Battery, w => {
        w.toggleClassName('half', Battery.percent < 46);
        w.toggleClassName('low', Battery.percent < 30);
    }]],
    children: [Overlay({
        vexpand: true,
        child: ProgressBar({
            hexpand: true,
            vexpand: true,
            connections: [[Battery, progress => {
                progress.fraction = Battery.percent / 100;
            }]],
        }),
        overlays: [Label({
            connections: [[Battery, l => {
                l.label = Battery.charging || Battery.charged
                    ? icons.battery.charging
                    : `${Battery.percent}%`;
            }]],
        })],
    })],
});

export default () => Box({
    className: 'header',
    children: [
        Avatar(),
        Box({
            className: 'system-box',
            vertical: true,
            hexpand: true,
            children: [
                Box({
                    children: [
                        Button({
                            valign: 'center',
                            onClicked: Theme.openSettings,
                            child: Icon(icons.settings),
                        }),
                        Label({
                            className: 'uptime',
                            hexpand: true,
                            valign: 'center',
                            connections: [[uptime, label => {
                                label.label = `uptime: ${uptime.value}`;
                            }]],
                        }),
                        Button({
                            valign: 'center',
                            onClicked: () => PowerMenu.action('logout'),
                            child: Icon(icons.powermenu.logout),
                        }),
                        Button({
                            valign: 'center',
                            onClicked: () => PowerMenu.action('shutdown'),
                            child: Icon(icons.powermenu.shutdown),
                        }),
                    ],
                }),
                BatteryProgress(),
            ],
        }),
    ],
});
