import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import { createSurfaceFromWidget, substitute } from '../utils.js';
import Gdk from 'gi://Gdk';
import Gtk from 'gi://Gtk?version=3.0';
import options from '../options.js';
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import icons from '../icons.js';

const SCALE = 0.08;
const TARGET = [Gtk.TargetEntry.new('text/plain', Gtk.TargetFlags.SAME_APP, 0)];

/** @param {string} args */
const dispatch = args => Hyprland.sendMessage(`dispatch ${args}`);

/** @param {string} str */
const icon = str => {
    const icon = substitute(options.substitutions.icons, str);
    if (Utils.lookUpIcon(icon))
        return icon;

    console.warn('no icon', icon);
    return icons.fallback.executable;
}

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

    setup: btn => btn
        .on('drag-data-get', (_w, _c, data) => data.set_text(address, address.length))
        .on('drag-begin', (_, context) => {
            Gtk.drag_set_icon_surface(context, createSurfaceFromWidget(btn));
            btn.toggleClassName('hidden', true);
        })
        .on('drag-end', () => btn.toggleClassName('hidden', false))
        .drag_source_set(Gdk.ModifierType.BUTTON1_MASK, TARGET, Gdk.DragAction.COPY),
});
