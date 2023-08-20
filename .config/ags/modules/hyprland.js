const { App } = ags;
const { Hyprland, Applications } = ags.Service;
const { execAsync, lookUpIcon } = ags.Utils;
const { Box, Button, Label, Icon } = ags.Widget;

export const Workspaces = ({
    fixed = 7,
    indicator,
    ...props
} = {}) => Box({
    ...props,
    children: Array.from({ length: fixed }, (_, i) => i + 1).map(i => Button({
        onClicked: () => execAsync(`hyprctl dispatch workspace ${i}`).catch(print),
        child: indicator ? indicator() : Label(`${i}`),
        connections: [[Hyprland, btn => {
            const { workspaces, active } = Hyprland;
            const occupied = workspaces.has(i) && workspaces.get(i).windows > 0;
            btn.toggleClassName('active', active.workspace.id === i);
            btn.toggleClassName('occupied', occupied);
            btn.toggleClassName('empty', !occupied);
        }]],
    })),
});

export const ClientLabel = ({
    show = 'title', // "class"|"title"
    substitutes = [], // { from: string, to: string }[]
    fallback = '',
    ...props
} = {}) => Label({
    ...props,
    connections: [[Hyprland, label => {
        let name = Hyprland.active.client[show] || fallback;
        substitutes.forEach(({ from, to }) => {
            if (name === from)
                name = to;
        });
        label.label = name;
    }]],
});

export const ClientIcon = ({
    symbolic = false,
    substitutes = [], // { from: string, to: string }[]
    fallback = '',
    ...props
} = {}) => Icon({
    ...props,
    connections: [[Hyprland, icon => {
        let classIcon = `${Hyprland.active.client.class}${symbolic ? '-symbolic' : ''}`;
        let titleIcon = `${Hyprland.active.client.title}${symbolic ? '-symbolic' : ''}`;
        substitutes.forEach(({ from, to }) => {
            if (classIcon === from)
                classIcon = to;

            if (titleIcon === from)
                titleIcon = to;
        });

        const hasTitleIcon = lookUpIcon(titleIcon);
        const hasClassIcon = lookUpIcon(classIcon);

        if (fallback)
            icon.icon = fallback;

        if (hasClassIcon)
            icon.icon = classIcon;

        if (hasTitleIcon)
            icon.icon = titleIcon;

        icon.visible = fallback || hasTitleIcon || hasClassIcon;
    }]],
});

const AppItem = ({ iconName }, { address, title }) => Button({
    child: Icon(iconName),
    tooltip: title,
    className: Hyprland.active.client.address === address.substring(2) ? 'focused' : 'nonfocused',
    onClicked: () => execAsync(`hyprctl dispatch focuswindow address:${address}`).catch(print),
});

export const Taskbar = ({
    item = AppItem,
    windowName,
    skip = [], // string[]
    ...props
}) => Box({
    ...props,
    connections: [
        [Applications, box => box._apps = Applications.query('')],
        [Hyprland, box => {
            if (windowName && !App.getWindow(windowName).visible)
                return;

            box.children = Array.from(Hyprland.clients.values()).map(client => {
                for (const appName of skip) {
                    if (client.class.toLowerCase().includes(appName.toLowerCase()))
                        return null;
                }
                for (const app of box._apps) {
                    if (client.title && app.match(client.title) ||
                        client.class && app.match(client.class))
                        return item(app, client);
                }
            });
        }],
    ],
});
