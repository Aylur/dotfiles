import icons from '../icons.js';
import Separator from '../misc/Separator.js';
import options from '../options.js';
const { App } = ags;
const { Hyprland, Applications } = ags.Service;
const { execAsync } = ags.Utils;
const { Box, Button, Icon, Overlay } = ags.Widget;

const pinned = [
    'firefox',
    'wezterm',
    'nautilus',
    'calendar',
    'obsidian',
    'discord',
    'caprine',
    'spotify',
    'transmission',
    'bottles',
    'org.gnome.software',
    'teams',
];

const AppButton = ({ icon, ...rest }) => Button({
    ...rest,
    child: Box({
        className: 'box',
        children: [Overlay({
            child: Icon({ icon, size: options.dockItemSize }),
            overlays: [Box({
                className: 'indicator',
                valign: 'end',
                halign: 'center',
            })],
        })],
    }),
});

const Taskbar = ({ windowName, skip = [] } = {}) => Box({
    properties: [['apps', Applications.query('')]],
    connections: [
        [Applications, box => box._apps = Applications.query('')],
        [Hyprland, box => {
            if (windowName && !App.getWindow(windowName).visible)
                return;

            box.children = Hyprland.clients.map(client => {
                for (const appName of skip) {
                    if (client.class.toLowerCase().includes(appName.toLowerCase()))
                        return null;
                }
                for (const app of box._apps) {
                    if (client.title && app.match(client.title) ||
                        client.class && app.match(client.class)) {
                        return AppButton({
                            icon: app.iconName,
                            tooltipText: app.name,
                            onMiddleClick: () => app.launch(),
                        });
                    }
                }
            });
        }],
    ],
});

const PinnedApps = ({ list, vertical }) => Box({
    className: 'pins',
    homogeneous: true,
    vertical,
    children: list
        .map(term => ({ app: Applications.query(term)?.[0], term }))
        .filter(({ app }) => app)
        .map(({ app, term = true }) => AppButton({
            icon: app.iconName,
            onPrimaryClick: () => {
                for (const client of Hyprland.clients) {
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
                for (const client of Hyprland.clients) {
                    if (client.class.toLowerCase().includes(term))
                        running = client;
                }

                button.toggleClassName('nonrunning', !running);
                button.toggleClassName('focused', Hyprland.active.client.address === running.address?.substring(2));
                button.set_tooltip_text(running ? running.title : app.name);
            }]],
        })),
});

export default ({ vertical = false } = {}) => Box({
    className: 'dock',
    vertical,
    children: [
        AppButton({
            className: 'launcher nonrunning',
            icon: icons.apps.apps,
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
            orientation: 'vertical',
            connections: [[Hyprland, box => {
                box.visible = box.get_parent().children[3].children.length > 0;
            }]],
        }),
        Taskbar({
            vertical,
            skip: pinned,
            item: ({ iconName }, { address, title }) => AppButton({
                icon: iconName,
                tooltipText: title,
                className: Hyprland.active.client.address === address.substring(2) ? 'focused' : 'nonfocused',
                onClicked: () => execAsync(`hyprctl dispatch focuswindow address:${address}`).catch(print),
            }),
        }),
    ],
});
