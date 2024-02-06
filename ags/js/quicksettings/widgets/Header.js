import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import PowerMenu from '../../services/powermenu.js';
import Lockscreen from '../../services/lockscreen.js';
import Avatar from '../../misc/Avatar.js';
import icons from '../../icons.js';
import { openSettings } from '../../settings/theme.js';
import { uptime } from '../../variables.js';

export default () => Widget.Box({
    class_name: 'header horizontal',
    children: [
        Widget.Box({
            hpack: 'start', vpack: 'center', hexpand: true, children: [
                Avatar(),
                Widget.Box({
                    class_name: 'battery horizontal',
                    visible: Battery.bind('available'),
                    children: [
                        Widget.Icon({ icon: Battery.bind('icon_name') }),
                        Widget.Label({ label: Battery.bind('percent').transform(p => `${p}%`) }),
                    ],
                }),
                Widget.Label({
                    class_name: 'uptime',
                    label: uptime.bind().transform(v => `Uptime: ${v}`),
                }),
            ],
        }),
        Widget.Box({
            hpack: 'end', vpack: 'center', hexpand: true, children: [

                Widget.Button({
                    on_clicked: openSettings,
                    child: Widget.Icon(icons.ui.settings),
                }),
                Widget.Button({
                    on_clicked: () => Lockscreen.lockscreen(),
                    child: Widget.Icon(icons.lock),
                }),
                Widget.Button({
                    on_clicked: () => PowerMenu.action('shutdown'),
                    child: Widget.Icon(icons.powermenu.shutdown),
                }),
            ],
        }),
    ],
});
