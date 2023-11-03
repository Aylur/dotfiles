import Dock from './Dock.js';
import { Hyprland, Utils, Widget } from '../imports.js';

export default monitor => Widget.Window({
    monitor,
    name: `dock${monitor}`,
    class_name: 'floating-dock',
    anchor: ['bottom'],
    child: Widget.EventBox({
        vpack: 'start',
        on_hover: box => {
            Utils.timeout(300, () => box._revealed = true);
            box.child.children[0].revealChild = true;
        },
        on_hover_lost: box => {
            if (!box._revealed)
                return;

            Utils.timeout(300, () => box._revealed = false);
            box.child.children[0].revealChild = false;
        },
        child: Widget.Box({
            vertical: true,
            css: 'padding: 1px;',
            children: [
                Widget.Revealer({
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
                }),
                Widget.Box({
                    class_name: 'padding',
                    css: 'padding: 2px;',
                }),
            ],
        }),
    }),
});
