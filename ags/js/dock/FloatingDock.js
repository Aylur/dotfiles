import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Dock from './Dock.js';
import options from '../options.js';

/** @param {number} monitor */
export default monitor => {
    const revealer = Widget.Revealer({
        transition: 'slide_up',
        child: Dock(),
        setup: self => {
            const update = () => {
                const ws = Hyprland.getWorkspace(Hyprland.active.workspace.id);
                if (Hyprland.getMonitor(monitor)?.name === ws?.monitor)
                    self.reveal_child = ws?.windows === 0;
            };
            self
                .hook(Hyprland, update, 'client-added')
                .hook(Hyprland, update, 'client-removed')
                .hook(Hyprland.active.workspace, update);
        },
    });

    return Widget.Window({
        monitor,
        name: `dock${monitor}`,
        class_name: 'floating-dock',
        anchor: ['bottom'],
        child: Widget.Box({
            children: [
                revealer,
                Widget.Box({
                    class_name: 'padding',
                    css: 'padding: 2px;',
                }),
            ],
        }),
        connections: [
            ['enter-notify-event', () => {
                revealer.reveal_child = true;
            }],
            ['leave-notify-event', () => {
                revealer.reveal_child = false;
            }],
        ],
        binds: [['visible', options.bar.position, 'value', v => v !== 'bottom']],
    });
};

