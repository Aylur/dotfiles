const { Widget } = ags;
const { Gtk } = imports.gi;

const corner = (place, radius = 18) => {
    const widget = ags.Widget({
        type: imports.gi.Gtk.DrawingArea.new,
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

Widget.widgets['corners'] = ({ radius }) => Widget({
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
});
