import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Clock from '../misc/Clock.js';
import DesktopMenu from './DesktopMenu.js';
import options from '../options.js';

const DesktopClock = () => Widget.Box({
    class_name: 'clock-box-shadow',
    child: Widget.CenterBox({
        class_name: 'clock-box',
        start_widget: Clock({
            class_name: 'clock',
            hpack: 'center',
            format: '%H',
        }),
        center_widget: Widget.Box({
            class_name: 'separator-box',
            vertical: true,
            hexpand: true,
            hpack: 'center',
            children: [
                Widget.Separator({ vpack: 'center', vexpand: true }),
                Widget.Separator({ vpack: 'center', vexpand: true }),
            ],
        }),
        end_widget: Clock({
            class_name: 'clock',
            hpack: 'center',
            format: '%M',
        }),
    }),
});

const Desktop = () => Widget.EventBox({
    on_secondary_click: (_, event) => DesktopMenu().popup_at_pointer(event),
    child: Widget.Box({
        vertical: true,
        vexpand: true,
        hexpand: true,
        visible: options.desktop.clock.enable.bind('value'),
        setup: self => self.hook(options.desktop.clock.position, () => {
            const [hpack = 'center', vpack = 'center', offset = 64] =
                options.desktop.clock.position.value.split(' ') || [];

            // @ts-expect-error
            self.hpack = hpack; self.vpack = vpack;
            self.setCss(`margin: ${Number(offset)}px;`);
        }),
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
