const { Widget, App } = ags;
const { Hyprland, Applications } = ags.Service;
const { execAsync, lookUpIcon, warning } = ags.Utils;

Widget.widgets['hyprland/workspaces'] = ({
    fixed = 7,
    child,
    ...props
}) => Widget({
    ...props,
    type: 'box',
    children: Array.from({ length: fixed }, (_, i) => i + 1).map(i => ({
        type: 'button',
        onClick: () => execAsync(`hyprctl dispatch workspace ${i}`).catch(print),
        child: child ? Widget(child) : `${i}`,
        connections: [[Hyprland, btn => {
            const { workspaces, active } = Hyprland;
            const occupied = workspaces.has(i) && workspaces.get(i).windows > 0;
            btn.toggleClassName('active', active.workspace.id === i);
            btn.toggleClassName('occupied', occupied);
            btn.toggleClassName('empty', !occupied);
        }]],
    })),
});

Widget.widgets['hyprland/client-label'] = ({
    show = 'title', // "class"|"title"
    substitutes = [], // { from: string, to: string }[]
    fallback = '',
    ...props
}) => {
    if (!(show === 'title' || show === 'class')) {
        const err = 'show has to be "class" or "title" on hyprland/client-label';
        warning(err);
        return Widget(err);
    }

    return Widget({
        ...props,
        type: 'label',
        connections: [[Hyprland, label => {
            let name = Hyprland.active.client[show] || fallback;
            substitutes.forEach(({ from, to }) => {
                if (name === from)
                    name = to;
            });
            label.label = name;
        }]],
    });
};

Widget.widgets['hyprland/client-icon'] = ({
    symbolic = false,
    substitutes = [], // { from: string, to: string }[]
    fallback = '',
    ...props
}) => Widget({
    ...props,
    type: 'icon',
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
            icon.icon_name = fallback;

        if (hasClassIcon)
            icon.icon_name = classIcon;

        if (hasTitleIcon)
            icon.icon_name = titleIcon;

        icon.visible = fallback || hasTitleIcon || hasClassIcon;
    }]],
});

const _item = ({ iconName }, { address, title }) => ({
    type: 'button',
    child: { type: 'icon', icon: iconName },
    tooltip: title,
    className: Hyprland.active.client.address === address.substring(2) ? 'focused' : 'nonfocused',
    onClick: () => execAsync(`hyprctl dispatch focuswindow address:${address}`).catch(print),
});

Widget.widgets['hyprland/taskbar'] = ({
    item = _item,
    windowName,
    skip = [], // string[]
    ...props
}) => Widget({
    ...props,
    type: 'box',
    connections: [
        [Applications, box => box._apps = Applications.query('')],
        [Hyprland, box => {
            if (windowName && !App.getWindow(windowName).visible)
                return;

            box.get_children().forEach(ch => ch.destroy());
            Hyprland.clients.forEach(client => {
                for (const appName of skip) {
                    if (client.class.toLowerCase().includes(appName.toLowerCase()))
                        return;
                }
                for (const app of box._apps) {
                    if (client.title && app.match(client.title) || client.class && app.match(client.class)) {
                        box.add(Widget(item(app, client)));
                        return;
                    }
                }
            });
            box.show_all();
        }],
    ],
});
