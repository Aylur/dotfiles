const { Widget } = ags;
const { execAsync } = ags.Utils;
const { DateTime } = imports.gi.GLib;

Widget.widgets['clock'] = ({
    format = '%H:%M:%S %B %e. %A',
    interval = 1000,
    ...props
}) => Widget({
    ...props,
    type: 'label',
    connections: [[interval, label => label.label = DateTime.new_now_local().format(format)]],
});

Widget.widgets['uptime'] = props => Widget({
    ...props,
    type: 'label',
    connections: [[1000, label => {
        execAsync(['bash', '-c', "uptime | awk '{print $3}' | tr ',' ' '"])
            .then(time => label.label = time)
            .catch(print);
    }]],
});
