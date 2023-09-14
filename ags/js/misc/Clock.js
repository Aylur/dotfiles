const { Label } = ags.Widget;
const { DateTime } = imports.gi.GLib;

export default ({
    format = '%H:%M:%S %B %e. %A',
    interval = 1000,
    ...props
} = {}) => Label({
    className: 'clock',
    ...props,
    connections: [[interval, label =>
        label.label = DateTime.new_now_local().format(format),
    ]],
});
