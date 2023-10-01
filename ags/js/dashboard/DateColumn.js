import icons from '../icons.js';
import Clock from '../misc/Clock.js';
import * as vars from '../variables.js';
import { Widget } from '../imports.js';

const SysProgress = (type, title, unit) => Widget.Box({
    className: `circular-progress-box ${type}`,
    hexpand: true,
    binds: [['tooltipText', vars[type], 'value', v =>
        `${title}: ${Math.floor(v * 100)}${unit}`]],
    child: Widget.CircularProgress({
        hexpand: true,
        className: `circular-progress ${type}`,
        binds: [['value', vars[type]]],
        child: Widget.Icon(icons.system[type]),
        startAt: 0.75,
    }),
});

export default () => Widget.Box({
    vertical: true,
    className: 'datemenu',
    children: [
        Clock({ format: '%H:%M' }),
        Widget.Label({
            binds: [['label', vars.uptime, 'value', t => `uptime: ${t}`]],
        }),
        Widget.Box({
            className: 'calendar',
            children: [
                Widget({
                    type: imports.gi.Gtk.Calendar,
                    hexpand: true,
                    halign: 'center',
                }),
            ],
        }),
        Widget.Box({
            className: 'system-info',
            children: [
                SysProgress('cpu', 'Cpu', '%'),
                SysProgress('ram', 'Ram', '%'),
                SysProgress('temp', 'Temperature', '°'),
            ],
        }),
    ],
});
