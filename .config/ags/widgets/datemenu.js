const { execAsync, interval } = ags.Utils;
const { Widget, App } = ags;

const uptimeLabel = () => {
    const label = Widget({ type: 'label' });
    interval(label, 1000, () => {
        execAsync(['bash', '-c', "uptime | awk '{print $3}' | tr ',' ' '"], time => {
            label.label = time.trim();
        });
    });
    return label;
};

Widget.widgets['datemenu/popup-content'] = props => Widget({
    ...props,
    type: 'box',
    orientation: 'vertical',
    className: 'datemenu',
    children: [
        {
            type: 'clock',
            format: '%H:%M',
            className: 'clock',
        },
        {
            type: 'box',
            className: 'uptime',
            halign: 'center',
            children: [
                'uptime: ',
                uptimeLabel,
            ],
        },
        {
            type: 'box',
            className: 'calendar',
            children: [
                {
                    type: 'box',
                    halign: 'center',
                    hexpand: true,
                    children: [{ type: imports.gi.Gtk.Calendar.new }],
                },
            ],
        },
    ],
});

Widget.widgets['datemenu/panel-button'] = () => Widget({
    type: 'button',
    className: 'datemenu',
    onClick: () => App.toggleWindow('datemenu'),
    child: {
        type: 'clock',
        format: '%H:%M:%S  %A %d.',
    },
});
