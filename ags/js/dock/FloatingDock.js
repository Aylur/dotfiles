import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Dock from './Dock.js';
import options from '../options.js';
import Gdk from 'gi://Gdk';

/** @param {number} monitor */
export default monitor => {
    const revealer = Widget.Revealer({
        transition: 'slide_up',
        child: Dock(),
        setup: self => {
            self.is_hovered = false;

            const update = () => {
                const ws = Hyprland.getWorkspace(Hyprland.active.workspace.id);
                if (Hyprland.getMonitor(monitor)?.name === ws?.monitor)
                    self.reveal_child = self.is_hovered || ws?.windows === 0;
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
        setup: self => {
            self.connections = [
                ['enter-notify-event', () => {
                    revealer.is_hovered = true;
                    revealer.reveal_child = revealer.is_hovered;
                }],
                ['leave-notify-event', () => {
                    const [x, y] = self.get_pointer();
                    if (revealer.get_realized()) {
                        const dockRect = self.get_allocation();
                        const padding = -8;
                        if (x >= -padding && x <= dockRect.width + padding && y >= -padding && y <= dockRect.height + padding)
                            return;

                        revealer.is_hovered = false;
                        const ws = Hyprland.getWorkspace(Hyprland.active.workspace.id);
                        if (ws?.windows !== 0 && !revealer.is_hovered)
                            revealer.reveal_child = false;
                    }
                }],
            ]
        },
        binds: [['visible', options.bar.position, 'value', v => v !== 'bottom']],
    });
};

