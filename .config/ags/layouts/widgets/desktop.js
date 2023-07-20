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
                className: 'clock-box',
                children: [{
                    type: 'clock',
                    className: 'clock',
                    format: '%H:%M',
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
