import PanelButton from '../PanelButton.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import icons from "../../icons.js";
import FontIcon from "../../misc/FontIcon.js";
import { task } from '../../variables.js';

export const TaskLabel = () => Widget.Label({
    binds: [['label', task, 'value', task => String(task)]],
});

export const ClockIcon = () => FontIcon({
    label: icons.timer_off,
    binds: [['label', task, 'value', v => String(v) == '--' ? icons.timer_off : icons.timer_on]],
});


export default () => PanelButton({
    className: 'active-task',
    hexpand: true,
    content: Widget.Box({
        children: [
            ClockIcon(),
            TaskLabel(),
        ],
//        binds: [['tooltip-text', Hyprland.active, 'client', c => c.title]],
    }),
});
