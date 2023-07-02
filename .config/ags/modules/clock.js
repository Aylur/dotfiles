const { Widget } = ags;
const { DateTime } = imports.gi.GLib;

Widget.widgets['clock'] = ({
    format = '%H:%M:%S %B %e. %A',
    interval = 1000,
    ...props
}) => ags.Utils.interval(
    Widget({
        ...props,
        type: 'label',
    }),
    interval,
    label => {
        label.label = DateTime.new_now_local().format(format);
    },
);
