import Theme from '../services/theme/theme.js';
import Clock from '../misc/Clock.js';
import DesktopMenu from './DesktopMenu.js';
import { Widget } from '../imports.js';

const DesktopClock = () => Widget.Box({
    class_name: 'clock-box-shadow',
    child: Widget.CenterBox({
        class_name: 'clock-box',
        children: [
            Clock({
                class_name: 'clock',
                hpack: 'center',
                format: '%H',
            }),
            Widget.Box({
                class_name: 'separator-box',
                vertical: true,
                hexpand: true,
                hpack: 'center',
                children: [
                    Widget.Separator({ vpack: 'center', vexpand: true }),
                    Widget.Separator({ vpack: 'center', vexpand: true }),
                ],
            }),
            Clock({
                class_name: 'clock',
                hpack: 'center',
                format: '%M',
            }),
        ],
    }),
});

const Desktop = () => Widget.EventBox({
    on_secondary_click: (_, event) => DesktopMenu().popup_at_pointer(event),
    child: Widget.Box({
        vertical: true,
        vexpand: true,
        hexpand: true,
        connections: [[Theme, box => {
            const [hpack = 'center', vpack = 'center', offset = 64] =
                Theme.getSetting('desktop_clock')?.split(' ') || [];

            box.hpack = hpack;
            box.vpack = vpack;
            box.setCss(`margin: ${Number(offset)}px;`);
        }]],
        children: [
            DesktopClock(),
            Clock({ format: '%B %e. %A', class_name: 'date' }),
        ],
    }),
});

export default monitor => Widget.Window({
    monitor,
    name: `desktop${monitor}`,
    layer: 'background',
    class_name: 'desktop',
    anchor: ['top', 'bottom', 'left', 'right'],
    child: Desktop(),
});
