const { Gdk, Gtk } = imports.gi;
const { App } = ags;
const { Hyprland } = ags.Service;
const { execAsync } = ags.Utils;
const { Box, EventBox, Button, Icon } = ags.Widget;

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

const Client = ({ address, size: [w, h], class: c, title } = {}) => Button({
    className: 'client',
    child: Icon({
        style: `
            min-width: ${w * SCALE}px;
            min-height: ${h * SCALE}px;
        `,
        icon: substitute(c),
    }),
    tooltipText: title,
    onSecondaryClick: () => execAsync(`hyprctl dispatch closewindow address:${address}`).catch(print),
    onClicked: () => {
        execAsync(`hyprctl dispatch focuswindow address:${address}`)
            .then(() => App.closeWindow('overview'))
            .catch(print);
    },
    setup: button => {
        button.drag_source_set(Gdk.ModifierType.BUTTON1_MASK, TARGET, Gdk.DragAction.COPY);
        button.drag_source_set_icon_name(substitute(c));
        button.connect('drag-data-get', (_w, _c, data) => data.set_text(address, address.length));
    },
});

const Workspace = index => {
    const fixed = Gtk.Fixed.new();
    const widget = Box({
        className: 'workspace',
        valign: 'center',
        style: `
            min-width: ${1920 * SCALE}px;
            min-height: ${1080 * SCALE}px;
        `,
        connections: [[Hyprland, box => {
            box.toggleClassName('active', Hyprland.active.workspace.id === index);
        }]],
        children: [EventBox({
            hexpand: true,
            vexpand: true,
            onPrimaryClick: () => execAsync(`hyprctl dispatch workspace ${index}`).catch(print),
            setup: eventbox => {
                eventbox.drag_dest_set(Gtk.DestDefaults.ALL, TARGET, Gdk.DragAction.COPY);
                eventbox.connect('drag-data-received', (_w, _c, _x, _y, data) => {
                    execAsync(`hyprctl dispatch movetoworkspacesilent ${index},address:${data.get_text()}`).catch(print);
                });
            },
            child: fixed,
        })],
    });
    widget.update = clients => {
        clients = clients.filter(({ workspace: { id } }) => id === index);

        // this is for my monitor layout
        // shifts clients back by 1920px if necessary
        clients = clients.map(client => {
            const [x, y] = client.at;
            if (x > 1920)
                client.at = [x - 1920, y];
            return client;
        });

        fixed.get_children().forEach(ch => ch.destroy());
        clients.forEach(c => c.mapped && fixed.put(Client(c), c.at[0] * SCALE, c.at[1] * SCALE));
        fixed.show_all();
    };
    return widget;
};

export const Overview = ({ workspaces = 7, windowName = 'overview' } = {}) => Box({
    className: 'overview',
    children: Array.from({ length: workspaces }, (_, i) => i + 1).map(Workspace),
    properties: [['update', box => {
        execAsync('hyprctl -j clients').then(clients => {
            const json = JSON.parse(clients);
            box.get_children().forEach(ch => ch.update(json));
        }).catch(print);
    }]],
    setup: box => box._update(box),
    connections: [[Hyprland, box => {
        if (!App.getWindow(windowName).visible)
            return;

        box._update(box);
    }]],
});
