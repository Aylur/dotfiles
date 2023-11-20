import App from 'resource:///com/github/Aylur/ags/app.js';
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Applications from 'resource:///com/github/Aylur/ags/service/applications.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import icons from '../icons.js';
import options from '../options.js';
import { launchApp, range } from '../utils.js';

const focus = ({ address }) => Hyprland.sendMessage(`dispatch focuswindow address:${address}`);

/** @param {import('types/widgets/button').ButtonProps & { icon: string, pinned?: boolean }} o */
const AppButton = ({ icon, pinned = false, ...rest }) => {
    const indicators = Widget.Box({
        vpack: 'end',
        hpack: 'center',
        children: range(5, 0).map(() => Widget.Box({
            class_name: 'indicator',
            visible: false,
        })),
    });

    const button = Widget.Button({
        ...rest,
        child: Widget.Box({
            class_name: 'box',
            child: Widget.Overlay({
                child: Widget.Icon({
                    icon,
                    binds: [['size', options.desktop.dock.icon_size]],
                }),
                pass_through: true,
                overlays: pinned ? [indicators] : [],
            }),
        }),
    });

    return Object.assign(button, { indicators });
};

const Taskbar = () => Widget.Box({
    binds: [['children', Hyprland, 'clients', c => c.map(client => {
        for (const appName of options.desktop.dock.pinned_apps.value) {
            if (client.class.toLowerCase().includes(appName.toLowerCase()))
                return null;
        }
        for (const app of Applications.list) {
            if (client.title && app.match(client.title) ||
                client.class && app.match(client.class)) {
                return AppButton({
                    icon: app.icon_name || '',
                    tooltip_text: app.name,
                    on_primary_click: () => focus(client),
                    on_middle_click: () => launchApp(app),
                });
            }
        }
    })]],
});

const PinnedApps = () => Widget.Box({
    class_name: 'pins',
    homogeneous: true,
    binds: [['children', options.desktop.dock.pinned_apps, 'value', v => v
        .map(term => ({ app: Applications.query(term)?.[0], term }))
        .filter(({ app }) => app)
        .map(({ app, term = true }) => AppButton({
            pinned: true,
            icon: app.icon_name || '',
            on_primary_click: () => {
                for (const client of Hyprland.clients) {
                    if (client.class.toLowerCase().includes(term))
                        return focus(client);
                }

                launchApp(app);
            },
            on_middle_click: () => launchApp(app),
            tooltip_text: app.name,
            connections: [[Hyprland, button => {
                const running = Hyprland.clients
                    .filter(client => client.class.toLowerCase().includes(term));

                const focused = running.find(client =>
                    client.address === Hyprland.active.client.address);

                const index = running.findIndex(c => c === focused);

                for (let i = 0; i < 5; ++i) {
                    const indicator = button.indicators.children[i];
                    indicator.visible = i < running.length;
                    indicator.toggleClassName('focused', i === index);
                }

                button.set_tooltip_text(running.length === 1 ? running[0].title : app.name);
            }]],
        })),
    ]],
});

export default () => {
    const pinnedapps = PinnedApps();
    const taskbar = Taskbar();
    const applauncher = AppButton({
        class_name: 'launcher nonrunning',
        icon: icons.apps.apps,
        tooltip_text: 'Applications',
        on_clicked: () => App.toggleWindow('applauncher'),
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
