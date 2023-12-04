import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import GLib from 'gi://GLib';

/**
 * @param {import('types/widgets/label').Props & {
 *   format?: string,
 *   interval?: number,
 * }} o
 */
export default ({
    format = '%H:%M:%S %B %e. %A',
    interval = 1000,
    ...rest
} = {}) => Widget.Label({
    class_name: 'clock',
    ...rest,
    connections: [[interval, label =>
        label.label = GLib.DateTime.new_now_local().format(format) || 'wrong format',
    ]],
});
