import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Dock from './Dock.js';
import options from '../options.js';

/** @param {number} monitor */
export default monitor => {
    let revealed = false;

    const revealer = Widget.Revealer({
        transition: 'slide_up',
        child: Dock(),
        setup: self => {
            const update = () => {
                const ws = Hyprland.getWorkspace(Hyprland.active.workspace.id);
                if (Hyprland.getMonitor(monitor)?.name === ws?.monitor)
                    self.reveal_child = ws?.windows === 0;
            };
            self.connectTo(Hyprland, update, 'client-added');
            self.connectTo(Hyprland, update, 'client-removed');
            self.connectTo(Hyprland.active.workspace, update);
        },
    });

    const box = Widget.Box({
        vertical: true,
        css: 'padding: 1px;',
        children: [
            revealer,
            Widget.Box({
                class_name: 'padding',
                css: 'padding: 2px;',
            }),
        ],
    });

    const eventbox = Widget.EventBox({
        child: box,
        vpack: 'start',
        on_hover: () => {
            Utils.timeout(300, () => revealed = true);
            revealer.reveal_child = true;
        },
        on_hover_lost: () => {
            if (!revealed)
                return;

            Utils.timeout(300, () => revealed = false);
            revealer.reveal_child = false;
        },
    });

    return Widget.Window({
        monitor,
        name: `dock${monitor}`,
        class_name: 'floating-dock',
        anchor: ['bottom'],
        child: eventbox,
        binds: [['visible', options.bar.position, 'value', v => v !== 'bottom']],
    });
};

