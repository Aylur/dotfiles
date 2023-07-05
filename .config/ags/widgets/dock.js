const { Widget } = ags;
const { Hyprland, Applications } = ags.Service;
const { timeout, execAsync } = ags.Utils;

const _appButton = (iconSize, iconName) => ({
    type: 'button',
    child: {
        type: 'overlay',
        children: [
            {
                type: 'icon',
                size: iconSize,
                icon: iconName,
            },
            {
                type: 'box',
                className: 'indicator',
                valign: 'end',
                halign: 'center',
            },
        ],
    },
});

const _pins = (iconSize, list) => ({
    type: 'box',
    homogeneous: true,
    children: list
        .map(([term, single]) => ({ app: Applications.query(term)?.[0], term, single }))
        .filter(({ app }) => app !== undefined)
        .map(({ app, term, single = true }) => ({
            ..._appButton(iconSize, app.iconName),
            onClick: () => {
                if (!single)
                    return app.launch();

                for (const [, client] of Hyprland.clients) {
                    if (client.class.toLowerCase().includes(term))
                        return execAsync(`hyprctl dispatch focuswindow address:${client.address}`);
                }

                app.launch();
            },
            tooltip: app.name,
            connections: [[Hyprland, button => {
                if (!single)
                    return;

                let running = false;
                for (const [, client] of Hyprland.clients) {
                    if (client.class.toLowerCase().includes(term))
                    running = client;
                }

                button.toggleClassName('nonrunning', !running);
                button.toggleClassName('focused', Hyprland.active.client.address === running.address?.substring(2));
                button.set_tooltip_text(running ? running.title : app.name)
            }]],
        })),
});

Widget.widgets['dock'] = ({ iconSize = 48 }) => Widget({
    type: 'box',
    className: 'dock',
    children: [
        {
            type: 'button',
            tooltip: 'Applications',
            onClick: () => ags.App.toggleWindow('applauncher'),
            child: {
                type: 'icon',
                icon: 'view-app-grid-symbolic',
                size: iconSize,
            },
        },
        _pins(iconSize, [
            ['firefox', false],
            ['wezterm', false],
            ['nautilus'],
            ['spotify'],
            ['caprine'],
            ['discord'],
            ['transmission'],
        ]),
        {
            type: 'box',
            valign: 'center',
            className: 'separator',
            connections: [[Hyprland, box => {
                box.visible = Hyprland.clients.size > 0;
            }]],
        },
        {
            type: 'hyprland/taskbar',
            skip: ['discord', 'caprine', 'nautilus', 'spotify', 'transmission'],
            item: ({ iconName }, { address, title }) => ({
                ..._appButton(iconSize, iconName),
                tooltip: title,
                className: Hyprland.active.client.address === address.substring(2) ? 'focused' : 'nonfocused',
                onClick: () => execAsync(`hyprctl dispatch focuswindow address:${address}`),
            }),
        },
    ],
});

Widget.widgets['floating-dock'] = () => Widget({
    type: 'eventbox',
    className: 'floating-dock',
    valign: 'start',
    onHover: box => {
        timeout(300, () => box._revealed = true);
        box.get_child().get_children()[0].reveal_child = true;
    },
    onHoverLost: box => {
        if (!box._revealed)
            return;

        timeout(300, () => box._revealed = false);
        box.get_child().get_children()[0].reveal_child = false;
    },
    child: {
        type: 'box',
        orientation: 'vertical',
        style: 'padding: 1px;',
        children: [
            {
                transition: 'slide_up',
                type: 'revealer',
                child: { type: 'dock' },
            },
            {
                type: 'box',
                className: 'padding',
                style: 'padding: 2px;',
            },
        ],
    },
});
