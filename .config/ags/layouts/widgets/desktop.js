const { Widget } = ags;
const { Theme } = ags.Service;

Widget.widgets['desktop'] = props => Widget({
    ...props,
    type: 'box',
    className: 'desktop',
    children: [{
        type: 'box',
        orientation: 'vertical',
        vexpand: true,
        hexpand: true,
        connections: [[Theme, box => {
            const [halign = 'center', valign = 'center', offset = 64] =
                Theme.getSetting('desktop_clock')?.split(' ') || [];

            box.halign = imports.gi.Gtk.Align[halign.toUpperCase()];
            box.valign = imports.gi.Gtk.Align[valign.toUpperCase()];
            box.setStyle(`margin: ${Number(offset)}px;`);
        }]],
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
