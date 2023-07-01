const { Gdk, Gtk } = imports.gi;
const { App, Widget } = ags;
const { Hyprland } = ags.Service;
const { execAsync } = ags.Utils;

const SCALE = 0.08;
const TARGET = [Gtk.TargetEntry.new('text/plain', Gtk.TargetFlags.SAME_APP, 0)];

const substitute = str => {
    const subs = [
        { from: 'com.transmissionbt.Transmission._40_219944', to: 'com.transmissionbt.Transmission' },
        { from: 'Caprine', to: 'facebook-messenger' }
    ];
    for (const { from, to } of subs)
        if (from === str)
            return to;

    return str;
} 

const client = ({ address, size: [w, h], class: c }) => {
    const icon = substitute(c);
    const box = Widget({
        type: 'button',
        className: c,
        child: {
            type: 'icon',
            className: 'icon',
            icon,
        },
    });
    box.set_size_request(w*SCALE, h*SCALE);

    box.drag_source_set(Gdk.ModifierType.BUTTON1_MASK, TARGET, Gdk.DragAction.COPY);
    box.drag_source_set_icon_name(icon);
    box.connect('drag-data-get', (_w, _c, data, _i, _t) => data.set_text(address, address.length));
    return box;
};

const workspace = (ws, isActive) => {
    let clients = Hyprland.HyprctlGet('clients').filter(({ workspace: { id } }) => id === ws)

    // this is for my monitor layout
    // shifts clients back by 1920px if necessary
    // this is because hyprland counts offset by multimonitor setups
    clients = clients.map(client => {
        const [x, y] = client.at;
        if (x > 1920)
            client.at = [x-1920, y];
        return client;
    });

    const fixed = Gtk.Fixed.new();
    clients.forEach(c => fixed.put(client(c), c.at[0]*SCALE, c.at[1]*SCALE));

    const eventbox = Widget({
        type: 'eventbox',
        hexpand: true,
        vexpand: true,
        onClick: () => execAsync(`hyprctl dispatch workspace ${ws}`),
    });
    eventbox.drag_dest_set(Gtk.DestDefaults.ALL, TARGET, Gdk.DragAction.COPY);
    eventbox.connect('drag-data-received', (_w, _c, _x, _y, data, _i, _t) => {
        execAsync(`hyprctl dispatch movetoworkspacesilent ${ws},address:${data.get_text()}`)
    });
    eventbox.add(fixed);

    return Widget({
        type: 'box',
        className: `workspace ${isActive ? 'active' : ''}`,
        valign: 'center',
        style: `
            min-width: ${1920*SCALE}px;
            min-height: ${1080*SCALE}px;
        `,
        children: [eventbox],
    });
}

Widget.widgets['overview'] = () => {
    const update = () => {
        if (!App.getWindow('overview')?.visible)
            return;

        box.get_children().forEach(ch => ch.destroy());

        const active = Hyprland.active.workspace.id;
        for (let i=1; i<8; ++i)
            box.add(workspace(i, active === i));

        box.show_all();
    };

    const box = Widget({
        type: 'box',
        className: 'overview',
    });

    Hyprland.connect(box, update);
    App.connect('window-toggled', (_app, window) => {
        if (window !== 'overview')
            return false;

        update();
    });
    return box;
}
