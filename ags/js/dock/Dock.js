import icons from '../icons.js';
import Separator from '../misc/Separator.js';
import options from '../options.js';
const { Hyprland, Applications } = ags.Service;
const { execAsync } = ags.Utils;
const { Box, Button, Icon, Overlay } = ags.Widget;

const pinned = [
    'firefox',
    'org.wezfurlong.wezterm',
    'org.gnome.Nautilus',
    'org.gnome.Calendar',
    'obsidian',
    'transmission-gtk',
    'caprine',
    'teams-for-linux',
    'discord',
    'spotify',
    'com.usebottles.bottles',
    'org.gnome.Software',
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

const Taskbar = skip => Box({
    properties: [['apps', Applications.query('')]],
    connections: [
        [Applications, box => box._apps = Applications.query('')],
        [Hyprland, box => box.children = Hyprland.clients.map(client => {
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
        })],
    ],
});

const PinnedApps = list => Box({
    className: 'pins',
    homogeneous: true,
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

export default () => {
    const pinnedapps = PinnedApps(pinned);
    const taskbar = Taskbar(pinned);
    const applauncher = AppButton({
        className: 'launcher nonrunning',
        icon: icons.apps.apps,
        tooltipText: 'Applications',
        onClicked: () => ags.App.toggleWindow('applauncher'),
    });
    const separator = Separator({
        valign: 'center',
        halign: 'center',
        orientation: 'vertical',
        connections: [[Hyprland, box => box.visible = taskbar.children.length > 0]],
    });
    return Box({
        className: 'dock',
        children: [applauncher, pinnedapps, separator, taskbar],
    });
};
