const { Widget, App } = ags;
const { Hyprland, Applications } = ags.Service;
const { execAsync, lookUpIcon, warning } = ags.Utils;

Widget.widgets['hyprland/workspaces'] = ({
    monitors, // number[]
    fixed, // number
    active, // Widget
    empty, // Widget
    occupied, // Widget
    ...props
}) => {
    if (!monitors && !fixed) {
        const err = 'hyprland/workspaces needs either "fixed" or "monitors" to be defined';
        warning(err);
        return Widget(err);
    }

    const button = (windows, i) => {
        const { active: { workspace }, workspaces } = Hyprland;

        const child = workspace.id === i
            ? active
            : windows > 0
                ? occupied
                : empty;

        return Widget({
            type: 'button',
            onClick: () => execAsync(`hyprctl dispatch workspace ${i}`),
            className: `${workspace.id === i ? 'active' : ''} ${windows > 0 ? 'occupied' : 'empty'}`,
            child: child ? Widget(child) : `${workspaces.get(i)?.name || i}`,
        });
    };

    const forFixed = box => {
        box.get_children().forEach(ch => ch.destroy());
        const { workspaces } = Hyprland;
        for (let i=1; i<fixed+1; ++i) {
            if (workspaces.has(i)) {
                const { windows } = workspaces.get(i);
                box.add(button(windows, i));
            } else {
                box.add(button(0, i));
            }
        }
    };

    const forMonitors = box => {
        box.get_children().forEach(ch => ch.destroy());
        Hyprland.workspaces.forEach(({ id, windows, monitor }) => {
            if (monitors.includes(Hyprland.monitors.get(monitor).id))
                box.add(button(windows, id));
        });
    };

    return Widget({
        ...props,
        type: 'box',
        connections: [[Hyprland, box => {
            fixed ? forFixed(box) : forMonitors(box);
            box.show_all();
        }]],
    });
};

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
    onClick: () => execAsync(`hyprctl dispatch focuswindow address:${address}`),
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
