import { createSurfaceFromWidget } from '../utils.js';
import Gdk from 'gi://Gdk';
import Gtk from 'gi://Gtk';
import { Hyprland, Utils, Widget, App } from '../imports.js';
import options from '../options.js';

const SCALE = 0.08;
const TARGET = [Gtk.TargetEntry.new('text/plain', Gtk.TargetFlags.SAME_APP, 0)];

const dispatch = args => Utils.execAsync(`hyprctl dispatch ${args}`);

const substitute = str => options.substitutions.icons
    .find(([from]) => from === str)?.[1] || str;

const Client = ({ address, size: [w, h], class: c, title }) => Widget.Button({
    class_name: 'client',
    tooltipText: title,
    child: Widget.Icon({
        css: `
            min-width: ${w * SCALE}px;
            min-height: ${h * SCALE}px;
        `,
        icon: substitute(c),
    }),
    onSecondaryClick: () => dispatch(`closewindow address:${address}`),
    onClicked: () => dispatch(`focuswindow address:${address}`)
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

export default index => {
    const fixed = Gtk.Fixed.new();

    const widget = Widget.Box({
        class_name: 'workspace',
        vpack: 'center',
        css: `
            min-width: ${1920 * SCALE}px;
            min-height: ${1080 * SCALE}px;
        `,
        connections: [[Hyprland, box => {
            box.toggleClassName('active', Hyprland.active.workspace.id === index);
        }]],
        child: Widget.EventBox({
            hexpand: true,
            vexpand: true,
            onPrimaryClick: () => dispatch(`workspace ${index}`),
            setup: eventbox => {
                eventbox.drag_dest_set(Gtk.DestDefaults.ALL, TARGET, Gdk.DragAction.COPY);
                eventbox.connect('drag-data-received', (_w, _c, _x, _y, data) => {
                    dispatch(`movetoworkspacesilent ${index},address:${data.get_text()}`);
                });
            },
            child: fixed,
        }),
    });

    widget.update = clients => {
        fixed.get_children().forEach(ch => ch.destroy());
        clients
            .filter(({ workspace: { id } }) => id === index)
            .forEach(c => {
                c.at[0] -= Hyprland.monitors.find(m => m.name === Hyprland.getWorkspace(c.workspace.id).monitor).x;
                c.at[1] -= Hyprland.monitors.find(m => m.name === Hyprland.getWorkspace(c.workspace.id).monitor).y;
                c.mapped && fixed.put(Client(c), c.at[0] * SCALE, c.at[1] * SCALE);
            });

        fixed.show_all();
    };

    return widget;
};
