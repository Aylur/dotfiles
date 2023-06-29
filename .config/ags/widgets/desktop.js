const { Widget } = ags;
const { Hyprland } = ags.Service;
const { Gtk } = imports.gi;

Widget.widgets['wallpaper'] = () => Widget({
    type: 'dynamic',
    items: imports.settings.wallpapers.map((w, i) => ({
        value: i,
        widget: {
            type: 'box',
            hexpand: true,
            vexpand: true,
            className: 'wallpaper',
            style: `
                background-image: url("${w}");
                background-size: cover;
            `,
        }
    })),
    connections: [[Hyprland, d => {
        const ws = Hyprland.active.workspace.id;
        if (d._ws !== ws) {
            d._ws = ws;
            d.update(v => v === ws);
        }
    }]],
});

const corner = (place, radius) => {
    const widget = ags.Widget({
        type: Gtk.DrawingArea.new,
        className: 'corner',
        hexpand: true,
        vexpand: true,
        halign: place.includes('left') ? 'start' : 'end',
        valign: place.includes('top') ? 'start' : 'end',
        connections: [['draw', (_w, cr) => {
            const c = widget.get_style_context().get_property('background-color', Gtk.StateFlags.NORMAL);
            switch (place) {
            case 'topleft':
                cr.arc(radius, radius,
                    radius, Math.PI, 3 * Math.PI / 2);
                cr.lineTo(0, 0);
                break;

            case 'topright':
                cr.arc(0, radius,
                    radius, 3 * Math.PI / 2, 2 * Math.PI);
                cr.lineTo(radius, 0);
                break;

            case 'bottomleft':
                cr.arc(radius, 0,
                    radius, Math.PI / 2, Math.PI);
                cr.lineTo(0, radius);
                break;

            case 'bottomright':
                cr.arc(0, 0,
                    radius, 0, Math.PI / 2);
                cr.lineTo(radius, radius);
                break;
            }

            cr.closePath();
            cr.setSourceRGBA(c.red, c.green, c.blue, c.alpha);
            cr.fill();
        }]]
    });
    widget.set_size_request(radius, radius);
    return widget;
};

Widget.widgets['desktop'] = ({ radius = 18 }) => Widget({
    type: 'box',
    className: 'desktop',
    children: [{
        type: 'overlay',
        hexpand: true,
        vexpand: true,
        children: [
            { type: 'wallpaper' },
            {
                type: 'box',
                orientation: 'vertical',
                valign: 'center',
                halign: 'center',
                children: [
                    { type: 'clock', className: 'clock', format: '%H:%M' },
                    { type: 'clock', className: 'date', format: '%B %e. %A' },
                ]
            },
            {
                type: 'box',
                children: [
                    {
                        type: 'box',
                        hexpand: true,
                        orientation: 'vertical',
                        children: [
                            corner('topleft', radius),
                            corner('bottomleft', radius),
                        ]
                    },
                    {
                        type: 'box',
                        hexpand: true,
                        orientation: 'vertical',
                        children: [
                            corner('topright', radius),
                            corner('bottomright', radius),
                        ]
                    }
                ],
            }
        ],
    }],
});
