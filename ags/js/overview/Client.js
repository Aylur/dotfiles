import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import { createSurfaceFromWidget, substitute } from '../utils.js';
import Gdk from 'gi://Gdk';
import Gtk from 'gi://Gtk';
import options from '../options.js';

const SCALE = 0.08;
const TARGET = [Gtk.TargetEntry.new('text/plain', Gtk.TargetFlags.SAME_APP, 0)];

/** @param {string} args */
const dispatch = args => Utils.execAsync(`hyprctl dispatch ${args}`);

/** @param {string} str */
const icon = str => substitute(options.substitutions.icons, str);

export default ({ address, size: [w, h], class: c, title }) => Widget.Button({
    class_name: 'client',
    tooltip_text: `${title}`,
    child: Widget.Icon({
        css: `
            min-width: ${w * SCALE}px;
            min-height: ${h * SCALE}px;
        `,
        icon: icon(c),
    }),
    on_secondary_click: () => dispatch(`closewindow address:${address}`),
    on_clicked: () => dispatch(`focuswindow address:${address}`)
        .then(() => App.closeWindow('overview')),

    setup: btn => {
        btn.drag_source_set(Gdk.ModifierType.BUTTON1_MASK, TARGET, Gdk.DragAction.COPY);
        btn.connect('drag-data-get', (_w, _c, data) => data.set_text(address, address.length));
        btn.connect('drag-begin', (_, context) => {
            Gtk.drag_set_icon_surface(context, createSurfaceFromWidget(btn));
            btn.toggleClassName('hidden', true);
        });
        btn.connect('drag-end', () => btn.toggleClassName('hidden', false));
    },
});
