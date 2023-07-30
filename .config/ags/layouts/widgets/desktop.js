const { Widget } = ags;

Widget.widgets['desktop'] = props => Widget({
    ...props,
    type: 'box',
    className: 'desktop',
    children: [{
        type: 'box',
        orientation: 'vertical',
        valign: 'center',
        halign: 'center',
        hexpand: true,
        children: [
            {
                type: 'box',
                className: 'clock-box-shadow',
                children: [{
                    type: 'centerbox',
                    className: 'clock-box',
                    children: [
                        {
                            type: 'clock',
                            className: 'clock',
                            halign: 'center',
                            format: '%H',
                        },
                        {
                            type: 'box',
                            className: 'separator-box',
                            orientation: 'vertical',
                            hexpand: true,
                            halign: 'center',
                            children: [
                                { type: 'separator', valign: 'center', vexpand: true },
                                { type: 'separator', valign: 'center', vexpand: true },
                            ],
                        },
                        {
                            type: 'clock',
                            halign: 'center',
                            className: 'clock',
                            format: '%M',
                        },
                    ],
                }],
            },
            {
                type: 'clock',
                className: 'date',
                format: '%B %e. %A',
            },
        ],
    }],
});
