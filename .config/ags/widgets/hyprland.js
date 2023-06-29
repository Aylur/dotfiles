const { Widget } = ags;
const { Hyprland, Applications } = ags.Service;
const { timeout } = ags.Utils;

Widget.widgets['workspaces'] = () => Widget({
    type: 'eventbox',
    className: 'workspaces',
    child: {
        type: 'hyprland/workspaces',
        fixed: 7,
        active: { type: 'label', label: '' },
        occupied: { type: 'label', label: '' },
        empty: { type: 'label', label: '', },
    },
});

Widget.widgets['client'] = () => Widget({
    type: 'box',
    className: 'client',
    children: [
        {
            type: 'hyprland/window-icon',
            size: 18,
            symbolic: true,
            substitutes: [
                { from: 'com.transmissionbt.Transmission._40_219944-symbolic', to: 'com.transmissionbt.Transmission-symbolic' },
                { from: 'blueberry.py-symbolic', to: 'bluetooth-symbolic' },
                { from: 'org.wezfurlong.wezterm-symbolic', to: 'folder-code-symbolic' },
                { from: 'Caprine-symbolic', to: 'facebook-messenger-symbolic' },
                { from: '-symbolic', to: 'preferences-desktop-display-symbolic' },
            ],
        },
        {
            type: 'hyprland/window-label',
            show: 'class',
            substitutes: [
                { from: 'com.transmissionbt.Transmission._40_219944', to: 'Transmission' },
                { from: 'com.obsproject.Studio', to: 'OBS' },
                { from: 'com.github.wwmm.easyeffects', to: 'Easy Effects' },
                { from: 'org.gnome.TextEditor', to: 'Text Editor' },
                { from: 'org.gnome.design.IconLibrary', to: 'Icon Library' },
                { from: 'blueberry.py', to: 'Blueberry' },
                { from: 'org.wezfurlong.wezterm', to: 'Wezterm' },
                { from: 'firefox', to: 'Firefox' },
                { from: 'org.gnome.Nautilus', to: 'Files' },
                { from: 'libreoffice-writer', to: 'Writer' },
                { from: '', to: 'Desktop' },
            ],
        },
    ],
});

const ICON_SIZE = 42;
const pins = list => ({
    type: 'box',
    homogeneous: true,
    children: list
        .map(term => Applications.query(term)?.[0])
        .filter(app => app !== undefined)
        .map(app => ({
                type: 'button',
                tooltip: app.name,
                onClick: app.launch,
                child: {
                    type: 'icon',
                    icon: app.iconName,
                    size: ICON_SIZE,
                },
            })),
});

Widget.widgets['dock'] = () => Widget({
    type: 'box',
    className: 'dock',
    children: [
        {
            type: 'button',
            tooltip: 'Applications',
            onClick: () => ags.App.toggleWindow('applauncher'),
            child: {
                type: 'icon',
                icon: 'view-app-grid-symbolic',
                size: ICON_SIZE,
            }
        },
        pins(['firefox', 'wezterm', 'nautilus', 'spotify']),
        {
            type: 'box',
            valign: 'center',
            className: 'separator',
            connections: [[Hyprland, box => {
                box.visible = Hyprland.clients.size > 0;
            }]]
        },
        {
            type: 'hyprland/taskbar',
            item: ({ iconName }, { address, title }) => ({
                type: 'button',
                child: {
                    type: 'overlay',
                    children: [
                        {
                            type: 'icon',
                            size: ICON_SIZE,
                            icon: iconName
                        },
                        {
                            type: 'box',
                            className: 'indicator',
                            valign: 'end',
                            halign: 'center',
                        }
                    ]
                },
                tooltip: title,
                className: Hyprland.active.client.address === address.substring(2) ? 'focused' : 'nonfocused',
                onClick: () => Hyprland.Hyprctl(`dispatch focuswindow address:${address}`),
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
                child: { type: 'dock' },
            },
            {
                type: 'box',
                className: 'padding',
                style: 'padding: 2px;',
            },
        ],
    },
});
