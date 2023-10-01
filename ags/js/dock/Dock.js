import icons from '../icons.js';
import Separator from '../misc/Separator.js';
import options from '../options.js';
import { App, Hyprland, Applications, Utils, Widget } from '../imports.js';

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

const AppButton = ({ icon, ...rest }) => Widget.Button({
    ...rest,
    child: Widget.Box({
        className: 'box',
        children: [Widget.Overlay({
            child: Widget.Icon({ icon, size: options.dockItemSize }),
            overlays: [Widget.Box({
                className: 'indicator',
                valign: 'end',
                halign: 'center',
            })],
        })],
    }),
});

const Taskbar = () => Widget.Box({
    binds: [['children', Hyprland, 'clients', c => c.map(client => {
        for (const appName of pinned) {
            if (client.class.toLowerCase().includes(appName.toLowerCase()))
                return null;
        }
        for (const app of Applications.list) {
            if (client.title && app.match(client.title) ||
                client.class && app.match(client.class)) {
                return AppButton({
                    icon: app.iconName,
                    tooltipText: app.name,
                    onMiddleClick: () => app.launch(),
                });
            }
        }
    })]],
});

const PinnedApps = () => Widget.Box({
    className: 'pins',
    homogeneous: true,
    children: pinned
        .map(term => ({ app: Applications.query(term)?.[0], term }))
        .filter(({ app }) => app)
        .map(({ app, term = true }) => AppButton({
            icon: app.iconName,
            onPrimaryClick: () => {
                for (const client of Hyprland.clients) {
                    if (client.class.toLowerCase().includes(term)) {
                        Utils.execAsync(`hyprctl dispatch focuswindow address:${client.address}`).catch(print);
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
            }, 'notify::clients']],
        })),
});

export default () => {
    const pinnedapps = PinnedApps();
    const taskbar = Taskbar();
    const applauncher = AppButton({
        className: 'launcher nonrunning',
        icon: icons.apps.apps,
        tooltipText: 'Applications',
        onClicked: () => App.toggleWindow('applauncher'),
    });
    const separator = Separator({
        valign: 'center',
        halign: 'center',
        orientation: 'vertical',
        connections: [[Hyprland, box => box.visible = taskbar.children.length > 0]],
    });
    return Widget.Box({
        className: 'dock',
        children: [applauncher, pinnedapps, separator, taskbar],
    });
};
