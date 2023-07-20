const { Gdk, Gtk } = imports.gi;
const { App, Widget } = ags;
const { Hyprland } = ags.Service;
const { execAsync } = ags.Utils;

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

const client = ({ address, size: [w, h], class: c, title }) => Widget({
    type: 'button',
    className: 'client',
    child: {
        type: 'icon',
        style: `
            min-width: ${w*SCALE}px;
            min-height: ${h*SCALE}px;
        `,
        icon: substitute(c),
    },
    tooltip: title,
    onSecondaryClick: () => execAsync('hyprctl dispatch closewindow address:'+address),
    setup: button => {
        button.drag_source_set(Gdk.ModifierType.BUTTON1_MASK, TARGET, Gdk.DragAction.COPY);
        button.drag_source_set_icon_name(substitute(c));
        button.connect('drag-data-get', (_w, _c, data) => data.set_text(address, address.length));
    },
});

const workspace = (ws, isActive) => Widget({
    type: 'box',
    className: `workspace ${isActive ? 'active' : ''}`,
    valign: 'center',
    style: `
        min-width: ${1920*SCALE}px;
        min-height: ${1080*SCALE}px;
    `,
    children: [{
        type: 'eventbox',
        hexpand: true,
        vexpand: true,
        onClick: () => execAsync(`hyprctl dispatch workspace ${ws}`),
        setup: eventbox => {
            eventbox.drag_dest_set(Gtk.DestDefaults.ALL, TARGET, Gdk.DragAction.COPY);
            eventbox.connect('drag-data-received', (_w, _c, _x, _y, data) => {
                execAsync(`hyprctl dispatch movetoworkspacesilent ${ws},address:${data.get_text()}`);
            });
        },
        child: {
            type: Gtk.Fixed.new,
            setup: fixed => {
                let clients = Hyprland.HyprctlGet('clients')
                    .filter(({ workspace: { id } }) => id === ws);

                // this is for my monitor layout
                // shifts clients back by 1920px if necessary
                clients = clients.map(client => {
                    const [x, y] = client.at;
                    if (x > 1920)
                        client.at = [x-1920, y];
                    return client;
                });

                clients.forEach(c => fixed.put(client(c), c.at[0]*SCALE, c.at[1]*SCALE));
            },
        },
    }],
});

Widget.widgets['overview'] = () => Widget({
    type: 'box',
    className: 'overview',
    properties: [
        ['update', box => {
            if (!App.getWindow('overview')?.visible)
                return;

            box.get_children().forEach(ch => ch.destroy());

            const active = Hyprland.active.workspace.id;
            for (let i=1; i<8; ++i)
                box.add(workspace(i, active === i));

            box.show_all();
        }],
    ],
    connections: [
        [Hyprland, box => {
            box._update(box);
        }],
        [App, (box, windowName) => {
            if (windowName !== 'overview')
                return false;

            box._update(box);
        }],
    ],
});
