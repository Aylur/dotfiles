import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import PanelButton from '../PanelButton.js';
import options from '../../options.js';
import { substitute } from '../../utils.js';

export const ClientLabel = () => Widget.Label({
    label: Hyprland.active.client.bind('class').transform(c => {
        const { titles } = options.substitutions;
        return substitute(titles, c);
    }),
});

export const ClientIcon = () => Widget.Icon({
    setup: self => self.hook(Hyprland.active.client, () => {
        const { icons } = options.substitutions;
        const { client } = Hyprland.active;

        const classIcon = substitute(icons, client.class) + '-symbolic';
        const titleIcon = substitute(icons, client.class) + '-symbolic';

        const hasTitleIcon = Utils.lookUpIcon(titleIcon);
        const hasClassIcon = Utils.lookUpIcon(classIcon);

        if (hasClassIcon)
            self.icon = classIcon;

        if (hasTitleIcon)
            self.icon = titleIcon;

        self.visible = !!(hasTitleIcon || hasClassIcon);
    }),
});

export default () => PanelButton({
    class_name: 'focused-client',
    content: Widget.Box({
        tooltip_text: Hyprland.active.bind('client').transform(c => c.title),
        children: [
            ClientIcon(),
            ClientLabel(),
        ],
    }),
});
