import icons from '../icons.js';
import Clock from '../misc/Clock.js';
import * as vars from '../variables.js';
import { Widget } from '../imports.js';
import Theme from '../services/theme/theme.js';

const SysProgress = (type, title, unit) => Widget.Box({
    class_name: `circular-progress-box ${type}`,
    hexpand: true,
    binds: [['tooltipText', vars[type], 'value', v =>
        `${title}: ${Math.floor(v * 100)}${unit}`]],
    child: Widget.CircularProgress({
        hexpand: true,
        class_name: `circular-progress ${type}`,
        child: Widget.Icon(icons.system[type]),
        start_at: 0.75,
        binds: [['value', vars[type]]],
        connections: [[Theme, prog => {
            prog.rounded = Theme.getSetting('radii') > 0;
        }]],
    }),
});

export default () => Widget.Box({
    vertical: true,
    class_name: 'datemenu',
    children: [
        Clock({ format: '%H:%M' }),
        Widget.Label({
            binds: [['label', vars.uptime, 'value', t => `uptime: ${t}`]],
        }),
        Widget.Box({
            class_name: 'calendar',
            children: [
                Widget.Calendar({
                    hexpand: true,
                    hpack: 'center',
                }),
            ],
        }),
        Widget.Box({
            class_name: 'system-info',
            children: [
                SysProgress('cpu', 'Cpu', '%'),
                SysProgress('ram', 'Ram', '%'),
                SysProgress('temp', 'Temperature', '°'),
            ],
        }),
    ],
});
