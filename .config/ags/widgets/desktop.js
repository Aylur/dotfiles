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
            className: `wallpaper ${i}`,
            style: `
                background-image: url("${w}");
                background-size: cover;
                background-position: bottom right;
            `,
        },
    })),
    connections: [[Hyprland, d => {
        const ws = Hyprland.active.workspace.id;
        if (d._ws !== ws) {
            d._ws = ws;
            d.update(v => v === ws);
        }
    }]],
});

Widget.widgets['corner'] = ({ place }) => Widget({
    type: Gtk.DrawingArea.new,
    className: 'corner',
    hexpand: true,
    vexpand: true,
    halign: place.includes('left') ? 'start' : 'end',
    valign: place.includes('top') ? 'start' : 'end',
    setup: widget => {
        widget.set_size_request(0, 0);
    },
    connections: [['draw', (widget, cr) => {
        const c = widget.get_style_context().get_property('background-color', Gtk.StateFlags.NORMAL);
        const r = widget.get_style_context().get_property('border-radius', Gtk.StateFlags.NORMAL);

        widget.set_size_request(r, r);

        switch (place) {
        case 'topleft':
            cr.arc(r, r,
                r, Math.PI, 3 * Math.PI / 2);
            cr.lineTo(0, 0);
            break;

        case 'topright':
            cr.arc(0, r,
                r, 3 * Math.PI / 2, 2 * Math.PI);
            cr.lineTo(r, 0);
            break;

        case 'bottomleft':
            cr.arc(r, 0,
                r, Math.PI / 2, Math.PI);
            cr.lineTo(0, r);
            break;

        case 'bottomright':
            cr.arc(0, 0,
                r, 0, Math.PI / 2);
            cr.lineTo(r, r);
            break;
        }

        cr.closePath();
        cr.setSourceRGBA(c.red, c.green, c.blue, c.alpha);
        cr.fill();
    }]],
});

Widget.widgets['desktop'] = props => Widget({
    ...props,
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
                ],
            },
        ],
    }],
    connections: [[Hyprland, box => {
        for (let i=0; i<9; ++i)
            box.toggleClassName(`${i}`, i === Hyprland.active.workspace.id);
    }]],
});
