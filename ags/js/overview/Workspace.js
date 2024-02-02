import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import Gdk from 'gi://Gdk';
import Gtk from 'gi://Gtk?version=3.0';
import Client from './Client.js';

const SCALE = 0.08;
const TARGET = [Gtk.TargetEntry.new('text/plain', Gtk.TargetFlags.SAME_APP, 0)];

/** @param {string} args */
const dispatch = args => Utils.execAsync(`hyprctl dispatch ${args}`);

/** @param {number} index */
export default index => {
    const fixed = Gtk.Fixed.new();

    return Widget.Box({
        class_name: 'workspace',
        vpack: 'center',
        css: `
            min-width: ${1920 * SCALE}px;
            min-height: ${1080 * SCALE}px;
        `,
        setup: box => box.hook(Hyprland, () => {
            box.toggleClassName('active', Hyprland.active.workspace.id === index);
        }),
        child: Widget.EventBox({
            hexpand: true,
            vexpand: true,
            on_primary_click: () => dispatch(`workspace ${index}`),
            setup: eventbox => {
                eventbox.drag_dest_set(Gtk.DestDefaults.ALL, TARGET, Gdk.DragAction.COPY);
                eventbox.connect('drag-data-received', (_w, _c, _x, _y, data) => {
                    dispatch(`movetoworkspacesilent ${index},address:${data.get_text()}`);
                });
            },
            child: fixed,
        }),

        /** @param {Array<import('types/service/hyprland').Client>} clients */
        attribute: clients => {
            fixed.get_children().forEach(ch => ch.destroy());
            clients
                .filter(({ workspace: { id } }) => id === index)
                .forEach(c => {
                    c.at[0] -= Hyprland.getMonitor(c.monitor)?.x || 0;
                    c.at[1] -= Hyprland.getMonitor(c.monitor)?.y || 0;
                    c.mapped && fixed.put(Client(c), c.at[0] * SCALE, c.at[1] * SCALE);
                });

            fixed.show_all();
        },
    });
};
