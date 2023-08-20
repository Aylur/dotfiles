import * as hyprland from '../../modules/hyprland.js';
const { Box, EventBox, Button } = ags.Widget;
const { execAsync } = ags.Utils;

export const Workspaces = props => Box({
    ...props,
    className: 'workspaces panel-button',
    children: [Box({
        children: [EventBox({
            className: 'eventbox',
            child: hyprland.Workspaces({
                indicator: () => Box({
                    className: 'indicator',
                    valign: 'center',
                    children: [Box({ className: 'fill' })],
                }),
            }),
        })],
    })],
});

export const Client = props => Button({
    ...props,
    className: 'client panel-button',
    onSecondaryClick: () => execAsync('hyprctl dispatch killactive'),
    child: Box({
        children: [
            hyprland.ClientIcon({
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
            }),
            hyprland.ClientLabel({
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
            }),
        ],
    }),
});
