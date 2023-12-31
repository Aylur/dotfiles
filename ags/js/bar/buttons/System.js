import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import PanelButton from '../PanelButton.js';
import * as variables from '../../variables.js';
import icons from '../../icons.js';

/** @param {'cpu' | 'ram'} type */
const System = type => {
    const icon = Widget.Icon({
        class_name: 'icon',
        icon: icons.system[type],
    });

    const progress = Widget.Box({
        class_name: 'progress',
        child: Widget.CircularProgress({
            value: variables[type].bind(),
        }),
    });

    const revealer = Widget.Revealer({
        transition: 'slide_right',
        child: Widget.Label({
            label: variables[type].bind('value').transform(v => {
                return ` ${type}: ${Math.round(v * 100)}%`;
            }),
        }),
    });

    return PanelButton({
        class_name: `system ${type}`,
        on_clicked: () => revealer.reveal_child = !revealer.reveal_child,
        content: Widget.EventBox({
            on_hover: () => revealer.reveal_child = true,
            on_hover_lost: () => revealer.reveal_child = false,
            child: Widget.Box({
                children: [
                    icon,
                    Widget.Box({
                        class_name: 'revealer',
                        child: revealer,
                    }),
                    progress,
                ],
            }),
        }),
    });
};

export const CPU = () => System('cpu');
export const RAM = () => System('ram');
