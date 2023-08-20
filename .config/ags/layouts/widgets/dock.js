import { Separator } from '../../modules/misc.js';
import { Taskbar } from '../../modules/hyprland.js';
const { Hyprland, Applications } = ags.Service;
const { timeout, execAsync } = ags.Utils;
const { Button, Box, EventBox, Icon, Revealer, Overlay } = ags.Widget;

const pinned = [
    'firefox',
    'wezterm',
    'discord',
    'caprine',
    'nautilus',
    'spotify',
    'transmission',
];

const AppButton = ({ icon, ...rest }) => Button({
    ...rest,
    child: Box({
        className: 'box',
        children: [Overlay({
            child: icon,
            overlays: [Box({
                className: 'indicator',
                valign: 'end',
                halign: 'center',
            })],
        })],
    }),
});

const PinnedApps = ({ list, vertical }) => Box({
    className: 'pins',
    homogeneous: true,
    vertical,
    children: list
        .map(term => ({ app: Applications.query(term)?.[0], term }))
        .filter(({ app }) => app)
        .map(({ app, term = true }) => AppButton({
            icon: Icon({ icon: app.iconName }),
            onPrimaryClick: () => {
                for (const [, client] of Hyprland.clients) {
                    if (client.class.toLowerCase().includes(term)) {
                        execAsync(`hyprctl dispatch focuswindow address:${client.address}`).catch(print);
                        return;
                    }
                }

                app.launch();
            },
            onMiddleClick: () => app.launch(),
            tooltipText: app.name,
            connections: [[Hyprland, button => {
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

export const Dock = ({
    launcher = 'view-app-grid-symbolic',
    vertical = false,
    ...props
} = {}) => Box({
    ...props,
    className: 'dock',
    vertical,
    children: [
        launcher && AppButton({
            className: 'launcher nonrunning',
            icon: Icon({ icon: launcher }),
            tooltipText: 'Applications',
            onClicked: () => ags.App.toggleWindow('applauncher'),
        }),
        PinnedApps({
            vertical,
            list: pinned,
        }),
        Separator({
            valign: 'center',
            halign: 'center',
            connections: [[Hyprland, box => {
                box.visible = box.get_parent().children[launcher ? 3 : 2].children.length > 0;
            }]],
        }),
        Taskbar({
            vertical,
            skip: pinned,
            item: ({ iconName }, { address, title }) => AppButton({
                icon: Icon({ icon: iconName }),
                tooltipText: title,
                className: Hyprland.active.client.address === address.substring(2) ? 'focused' : 'nonfocused',
                onClicked: () => execAsync(`hyprctl dispatch focuswindow address:${address}`).catch(print),
            }),
        }),
    ],
});

export const FloatingDock = () => EventBox({
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
    child: Box({
        vertical: true,
        style: 'padding: 1px;',
        children: [
            Revealer({
                transition: 'slide_up',
                child: Dock(),
            }),
            Box({
                className: 'padding',
                style: 'padding: 2px;',
            }),
        ],
    }),
});
