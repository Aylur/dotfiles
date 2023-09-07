import Clock from '../misc/Clock.js';
import { uptime } from '../variables.js';
const { Box, Label, Widget } = ags.Widget;

export default () => Box({
    vertical: true,
    className: 'datemenu',
    children: [
        Clock({ format: '%H:%M' }),
        Label({
            connections: [[uptime, label => {
                label.label = `uptime: ${uptime.value}`;
            }]],
        }),
        Box({
            className: 'calendar',
            children: [
                Widget({ type: imports.gi.Gtk.Calendar }),
            ],
        }),
    ],
});
