const { Widget } = ags;

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
                { type: 'uptime' },
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
