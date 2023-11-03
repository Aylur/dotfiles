import PanelButton from '../PanelButton.js';
import { Hyprland, Utils, Widget } from '../../imports.js';
import options from '../../options.js';
import { substitute } from '../../utils.js';
const { icons, titles } = options.substitutions;

export const ClientLabel = () => Widget.Label({
    binds: [['label', Hyprland.active.client, 'class', c => substitute(titles, c)]],
});

export const ClientIcon = () => Widget.Icon({
    connections: [[Hyprland.active.client, self => {
        const { client } = Hyprland.active;

        const classIcon = substitute(icons, client.class) + '-symbolic';
        const titleIcon = substitute(icons, client.class) + '-symbolic';

        const hasTitleIcon = Utils.lookUpIcon(titleIcon);
        const hasClassIcon = Utils.lookUpIcon(classIcon);

        if (hasClassIcon)
            self.icon = classIcon;

        if (hasTitleIcon)
            self.icon = titleIcon;

        self.visible = hasTitleIcon || hasClassIcon;
    }]],
});

export default () => PanelButton({
    class_name: 'focused-client',
    content: Widget.Box({
        children: [
            ClientIcon(),
            ClientLabel(),
        ],
        binds: [['tooltip-text', Hyprland.active, 'client', c => c.title]],
    }),
});
