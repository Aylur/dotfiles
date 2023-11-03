import icons from '../icons.js';
import options from '../options.js';
import { App, Hyprland, Applications, Utils, Widget } from '../imports.js';
import { launchApp } from '../utils.js';

const focus = ({ address }) => Utils.execAsync(`hyprctl dispatch focuswindow address:${address}`);

const AppButton = ({ icon, ...rest }) => Widget.Button({
    ...rest,
    child: Widget.Box({
        class_name: 'box',
        child: Widget.Overlay({
            child: Widget.Icon({ icon, size: options.dock.iconSize }),
            overlays: [Widget.Box({
                class_name: 'indicator',
                vpack: 'end',
                hpack: 'center',
            })],
        }),
    }),
});

const Taskbar = () => Widget.Box({
    binds: [['children', Hyprland, 'clients', c => c.map(client => {
        for (const appName of options.dock.pinnedApps) {
            if (client.class.toLowerCase().includes(appName.toLowerCase()))
                return null;
        }
        for (const app of Applications.list) {
            if (client.title && app.match(client.title) ||
                client.class && app.match(client.class)) {
                return AppButton({
                    icon: app.icon_name,
                    tooltipText: app.name,
                    onPrimaryClick: () => focus(client),
                    onMiddleClick: () => launchApp(app),
                });
            }
        }
    })]],
});

const PinnedApps = () => Widget.Box({
    class_name: 'pins',
    homogeneous: true,
    children: options.dock.pinnedApps
        .map(term => ({ app: Applications.query(term)?.[0], term }))
        .filter(({ app }) => app)
        .map(({ app, term = true }) => AppButton({
            icon: app.icon_name,
            onPrimaryClick: () => {
                for (const client of Hyprland.clients) {
                    if (client.class.toLowerCase().includes(term))
                        return focus(client);
                }

                launchApp(app);
            },
            onMiddleClick: () => launchApp(app),
            tooltipText: app.name,
            connections: [[Hyprland, button => {
                const running = Hyprland.clients
                    .find(client => client.class.toLowerCase().includes(term)) || false;

                button.toggleClassName('nonrunning', !running);
                button.toggleClassName('focused', Hyprland.active.client.address == running.address);
                button.set_tooltip_text(running ? running.title : app.name);
            }]],
        })),
});

export default () => {
    const pinnedapps = PinnedApps();
    const taskbar = Taskbar();
    const applauncher = AppButton({
        class_name: 'launcher nonrunning',
        icon: icons.apps.apps,
        tooltipText: 'Applications',
        onClicked: () => App.toggleWindow('applauncher'),
    });
    const separator = Widget.Separator({
        vpack: 'center',
        hpack: 'center',
        orientation: 1,
        connections: [[Hyprland, box => box.visible = taskbar.children.length > 0]],
    });
    return Widget.Box({
        class_name: 'dock',
        children: [applauncher, pinnedapps, separator, taskbar],
    });
};
