const { Widget } = ags;

const indicator = {
    type: 'box',
    className: 'indicator',
    valign: 'center',
    children: [{
        type: 'box',
        className: 'fill',
        hexpand: true,
        vexpand: true,
    }],
};

Widget.widgets['workspaces'] = () => Widget({
    type: 'eventbox',
    className: 'workspaces',
    child: {
        type: 'hyprland/workspaces',
        fixed: 7,
        active: indicator,
        occupied: indicator,
        empty: indicator,
    },
});

Widget.widgets['client'] = () => Widget({
    type: 'box',
    className: 'client',
    children: [
        {
            type: 'hyprland/client-icon',
            size: 18,
            symbolic: true,
            substitutes: [
                { from: 'com.transmissionbt.Transmission._43_219944-symbolic', to: 'com.transmissionbt.Transmission-symbolic' },
                { from: 'com.transmissionbt.Transmission._40_219944-symbolic', to: 'com.transmissionbt.Transmission-symbolic' },
                { from: 'blueberry.py-symbolic', to: 'bluetooth-symbolic' },
                { from: 'org.wezfurlong.wezterm-symbolic', to: 'folder-code-symbolic' },
                { from: 'Caprine-symbolic', to: 'facebook-messenger-symbolic' },
                { from: '-symbolic', to: 'preferences-desktop-display-symbolic' },
            ],
        },
        {
            type: 'hyprland/client-label',
            show: 'class',
            substitutes: [
                { from: 'com.transmissionbt.Transmission._43_219944', to: 'Transmission' },
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
