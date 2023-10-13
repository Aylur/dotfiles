import { createSurfaceFromWidget } from '../utils.js';
import Gdk from 'gi://Gdk';
import Gtk from 'gi://Gtk';
import { Hyprland, Utils, Widget, App } from '../imports.js';

const SCALE = 0.08;
const TARGET = [Gtk.TargetEntry.new('text/plain', Gtk.TargetFlags.SAME_APP, 0)];

function substitute(str) {
    const subs = [
        { from: 'Caprine', to: 'facebook-messenger' },
    ];

    for (const { from, to } of subs) {
        if (from === str)
            return to;
    }

    return str;
}

const Client = ({ address, size: [w, h], class: c, title } = {}) => Widget.Button({
    className: 'client',
    child: Widget.Icon({
        style: `
            min-width: ${w * SCALE}px;
            min-height: ${h * SCALE}px;
        `,
        icon: substitute(c),
    }),
    tooltipText: title,
    onSecondaryClick: () => Utils.execAsync(`hyprctl dispatch closewindow address:${address}`).catch(print),
    onClicked: () => {
        Utils.execAsync(`hyprctl dispatch focuswindow address:${address}`)
            .then(() => App.closeWindow('overview'))
            .catch(print);
    },
    setup: button => {
        button.drag_source_set(Gdk.ModifierType.BUTTON1_MASK, TARGET, Gdk.DragAction.COPY);
        button.connect('drag-data-get', (_w, _c, data) => data.set_text(address, address.length));
        button.connect('drag-begin', (_, context) => {
            Gtk.drag_set_icon_surface(context, createSurfaceFromWidget(button));
            button.toggleClassName('hidden', true);
        });
        button.connect('drag-end', () => button.toggleClassName('hidden', false));
    },
});

export default index => {
    const fixed = Gtk.Fixed.new();

    const widget = Widget.Box({
        className: 'workspace',
        valign: 'center',
        style: `
            min-width: ${1920 * SCALE}px;
            min-height: ${1080 * SCALE}px;
        `,
        connections: [[Hyprland, box => {
            box.toggleClassName('active', Hyprland.active.workspace.id === index);
        }]],
        child: Widget.EventBox({
            hexpand: true,
            vexpand: true,
            onPrimaryClick: () => Utils.execAsync(`hyprctl dispatch workspace ${index}`).catch(print),
            setup: eventbox => {
                eventbox.drag_dest_set(Gtk.DestDefaults.ALL, TARGET, Gdk.DragAction.COPY);
                eventbox.connect('drag-data-received', (_w, _c, _x, _y, data) => {
                    Utils.execAsync(`hyprctl dispatch movetoworkspacesilent ${index},address:${data.get_text()}`).catch(print);
                });
            },
            child: fixed,
        }),
    });

    widget.update = clients => {
        fixed.get_children().forEach(ch => ch.destroy());
        clients
            .filter(({ workspace: { id } }) => id === index)
            .forEach(c => c.mapped && fixed.put(Client(c), c.at[0] * SCALE, c.at[1] * SCALE));

        fixed.show_all();
    };

    return widget;
};
