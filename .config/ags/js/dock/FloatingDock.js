import Dock from './Dock.js';
const { timeout } = ags.Utils;
const { EventBox, Window, Box, Revealer } = ags.Widget;

export default monitor => Window({
    monitor,
    name: `dock${monitor}`,
    className: 'floating-dock',
    anchor: ['bottom'],
    child: EventBox({
        valign: 'start',
        onHover: box => {
            timeout(300, () => box._revealed = true);
            box.child.children[0].revealChild = true;
        },
        onHoverLost: box => {
            if (!box._revealed)
                return;

            timeout(300, () => box._revealed = false);
            box.child.children[0].revealChild = false;
        },
        child: Box({
            vertical: true,
            style: 'padding: 1px;',
            children: [
                Revealer({
                    transition: 'slide_up',
                    child: Dock(),
                }),
                Box({
                    className: 'padding',
                    style: 'padding: 2px;',
                }),
            ],
        }),
    }),
});
