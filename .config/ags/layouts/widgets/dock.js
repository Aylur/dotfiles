const { Widget } = ags;
const { Hyprland, Applications, Settings } = ags.Service;
const { timeout, execAsync } = ags.Utils;

const _appButton = (iconSize, icon) => ({
    type: 'button',
    child: {
        type: 'box',
        children: [{
            type: 'overlay',
            children: [
                typeof icon === 'string'
                    ? {
                        type: 'icon',
                        size: iconSize,
                        icon,
                    } : icon,
                {
                    type: 'box',
                    className: 'indicator',
                    valign: Settings.getStyle('layout') === 'unity' ? 'center' : 'end',
                    halign: Settings.getStyle('layout') === 'unity' ? 'start' : 'center',
                },
            ],
        }],
    },
});

const _pins = ({ iconSize, list, orientation }) => ({
    type: 'box',
    homogeneous: true,
    orientation,
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
            className: !single ? 'single' : '',
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
                button.set_tooltip_text(running ? running.title : app.name);
            }]],
        })),
});

Widget.widgets['dock'] = ({
    iconSize = 48,
    launcher = 'view-app-grid-symbolic',
    orientation,
    ...props
}) => Widget({
    ...props,
    type: 'box',
    orientation,
    children: [
        ...(launcher ? [{
            tooltip: 'Applications',
            onClick: () => ags.App.toggleWindow('applauncher'),
            ..._appButton(iconSize, launcher),
            className: 'launcher nonrunning',
        }] : []),
        _pins({
            iconSize,
            orientation,
            list: [
                ['firefox', false],
                ['wezterm', false],
                ['nautilus'],
                ['spotify'],
                ['caprine'],
                ['discord'],
                ['transmission'],
                ['bottles'],
            ],
        }),
        {
            type: 'box',
            valign: 'center',
            className: 'separator',
            connections: [[Hyprland, box => {
                box.visible = box.get_parent().get_children()[launcher ? 3 : 2].get_children().length > 0;
            }]],
        },
        {
            type: 'hyprland/taskbar',
            orientation,
            skip: [
                'discord',
                'caprine',
                'nautilus',
                'spotify',
                'transmission',
            ],
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
                child: { type: 'dock', className: 'dock' },
            },
            {
                type: 'box',
                className: 'padding',
                style: 'padding: 2px;',
            },
        ],
    },
});
