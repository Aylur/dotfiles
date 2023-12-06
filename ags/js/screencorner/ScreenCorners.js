import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Gtk from 'gi://Gtk';
import options from '../options.js';

/** @param {'topleft' | 'topright' | 'bottomleft' | 'bottomright'} place  */
const Corner = place => Widget.DrawingArea({
    class_name: 'corner',
    hexpand: true,
    vexpand: true,
    hpack: place.includes('left') ? 'start' : 'end',
    vpack: place.includes('top') ? 'start' : 'end',
    connections: [[options.radii, self => {
        const r = options.radii.value * 2;
        self.set_size_request(r, r);
    }]],
    setup: self => self.connect('draw', (self, cr) => {
        const context = self.get_style_context();
        const c = context.get_property('background-color', Gtk.StateFlags.NORMAL);
        const r = context.get_property('border-radius', Gtk.StateFlags.NORMAL);

        switch (place) {
            case 'topleft':
                cr.arc(r, r, r, Math.PI, 3 * Math.PI / 2);
                cr.lineTo(0, 0);
                break;

            case 'topright':
                cr.arc(0, r, r, 3 * Math.PI / 2, 2 * Math.PI);
                cr.lineTo(r, 0);
                break;

            case 'bottomleft':
                cr.arc(r, 0, r, Math.PI / 2, Math.PI);
                cr.lineTo(0, r);
                break;

            case 'bottomright':
                cr.arc(0, 0, r, 0, Math.PI / 2);
                cr.lineTo(r, r);
                break;
        }

        cr.closePath();
        cr.setSourceRGBA(c.red, c.green, c.blue, c.alpha);
        cr.fill();
    }),
});

/** @type {Array<'topleft' | 'topright' | 'bottomleft' | 'bottomright'>} */
const places = ['topleft', 'topright', 'bottomleft', 'bottomright'];

/** @param {number} monitor  */
export default monitor => places.map(place => Widget.Window({
    name: `corner${monitor}${place}`,
    monitor,
    class_name: 'corner',
    anchor: [place.includes('top') ? 'top' : 'bottom', place.includes('right') ? 'right' : 'left'],
    binds: [['visible', options.desktop.screen_corners]],
    child: Corner(place),
}));
