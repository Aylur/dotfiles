import Dock from './Dock.js';
import { Utils, Widget } from '../imports.js';

export default monitor => Widget.Window({
    monitor,
    name: `dock${monitor}`,
    className: 'floating-dock',
    anchor: ['bottom'],
    child: Widget.EventBox({
        valign: 'start',
        onHover: box => {
            Utils.timeout(300, () => box._revealed = true);
            box.child.children[0].revealChild = true;
        },
        onHoverLost: box => {
            if (!box._revealed)
                return;

            Utils.timeout(300, () => box._revealed = false);
            box.child.children[0].revealChild = false;
        },
        child: Widget.Box({
            vertical: true,
            style: 'padding: 1px;',
            children: [
                Widget.Revealer({
                    transition: 'slide_up',
                    child: Dock(),
                }),
                Widget.Box({
                    className: 'padding',
                    style: 'padding: 2px;',
                }),
            ],
        }),
    }),
});
