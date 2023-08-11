const { Widget } = ags;
const { execAsync } = ags.Utils;

Widget.widgets['workspaces'] = props => Widget({
    ...props,
    type: 'box',
    children: [{
        type: 'box',
        children: [{
            type: 'eventbox',
            className: 'eventbox',
            child: {
                type: 'hyprland/workspaces',
                child: {
                    type: 'box',
                    className: 'indicator',
                    valign: 'center',
                    children: [{
                        type: 'box',
                        className: 'fill',
                    }],
                },
            },
        }],
    }],
});

Widget.widgets['client'] = props => Widget({
    ...props,
    type: 'button',
    onSecondaryClick: () => execAsync('hyprctl dispatch killactive'),
    child: {
        type: 'box',
        children: [
            {
                type: 'hyprland/client-icon',
                symbolic: true,
                substitutes: [
                    { from: 'com.transmissionbt.Transmission._43_219944-symbolic', to: 'com.transmissionbt.Transmission-symbolic' },
                    { from: 'com.transmissionbt.Transmission._40_219944-symbolic', to: 'com.transmissionbt.Transmission-symbolic' },
                    { from: 'com.transmissionbt.Transmission._37_219944-symbolic', to: 'com.transmissionbt.Transmission-symbolic' },
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
                    { from: 'com.transmissionbt.Transmission._37_219944', to: 'Transmission' },
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
    },
});
