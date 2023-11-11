import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Clock from '../misc/Clock.js';
import DesktopMenu from './DesktopMenu.js';
import options from '../options.js';

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
        binds: [['visible', options.desktop.clock.enable]],
        connections: [[options.desktop.clock.position, box => {
            const [hpack = 'center', vpack = 'center', offset = 64] =
                options.desktop.clock.position.value.split(' ') || [];

            // @ts-expect-error
            box.hpack = hpack; box.vpack = vpack;
            box.setCss(`margin: ${Number(offset)}px;`);
        }]],
        children: [
            DesktopClock(),
            Clock({ format: '%B %e. %A', class_name: 'date' }),
        ],
    }),
});

/** @param {number} monitor */
export default monitor => Widget.Window({
    monitor,
    name: `desktop${monitor}`,
    layer: 'background',
    class_name: 'desktop',
    anchor: ['top', 'bottom', 'left', 'right'],
    child: Desktop(),
});
