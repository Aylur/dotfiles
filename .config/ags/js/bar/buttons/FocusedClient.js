import PanelButton from '../PanelButton.js';

const { Hyprland } = ags.Service;
const { lookUpIcon } = ags.Utils;
const { Box, Label, Icon } = ags.Widget;

export const ClientLabel = substitutes => Label({
    connections: [[Hyprland, label => {
        let name = Hyprland.active.client.class;
        substitutes.forEach(([from, to]) => {
            if (name === from)
                name = to;
        });
        label.label = name;
    }]],
});

export const ClientIcon = substitutes => Icon({
    connections: [[Hyprland, icon => {
        let classIcon = `${Hyprland.active.client.class}-symbolic`;
        let titleIcon = `${Hyprland.active.client.title}-symbolic`;
        substitutes.forEach(([from, to]) => {
            if (classIcon === from)
                classIcon = to;

            if (titleIcon === from)
                titleIcon = to;
        });

        const hasTitleIcon = lookUpIcon(titleIcon);
        const hasClassIcon = lookUpIcon(classIcon);

        if (hasClassIcon)
            icon.icon = classIcon;

        if (hasTitleIcon)
            icon.icon = titleIcon;

        icon.visible = hasTitleIcon || hasClassIcon;
    }]],
});

export default () => PanelButton({
    className: 'focused-client',
    content: Box({
        children: [
            ClientIcon([
                ['com.transmissionbt.Transmission._43_219944-symbolic', 'com.transmissionbt.Transmission-symbolic'],
                ['com.transmissionbt.Transmission._40_219944-symbolic', 'com.transmissionbt.Transmission-symbolic'],
                ['com.transmissionbt.Transmission._37_219944-symbolic', 'com.transmissionbt.Transmission-symbolic'],
                ['blueberry.py-symbolic', 'bluetooth-symbolic'],
                ['org.wezfurlong.wezterm-symbolic', 'folder-code-symbolic'],
                ['Caprine-symbolic', 'facebook-messenger-symbolic'],
                ['-symbolic', 'preferences-desktop-display-symbolic'],
            ]),
            ClientLabel([
                ['com.transmissionbt.Transmission._43_219944', 'Transmission'],
                ['com.transmissionbt.Transmission._40_219944', 'Transmission'],
                ['com.transmissionbt.Transmission._37_219944', 'Transmission'],
                ['com.obsproject.Studio', 'OBS'],
                ['com.github.wwmm.easyeffects', 'Easy Effects'],
                ['org.gnome.TextEditor', 'Text Editor'],
                ['org.gnome.design.IconLibrary', 'Icon Library'],
                ['blueberry.py', 'Blueberry'],
                ['org.wezfurlong.wezterm', 'Wezterm'],
                ['firefox', 'Firefox'],
                ['org.gnome.Nautilus', 'Files'],
                ['libreoffice-writer', 'Writer'],
                ['', 'Desktop'],
            ]),
        ],
    }),
});
