import icons from '../../icons.js';
import PanelButton from '../PanelButton.js';
import { Widget, Utils, Variable } from '../../imports.js';

const Arrow = (revealer, direction, items) => PanelButton({
    class_name: 'sub-menu',
    connections: [[items, btn => {
        btn.tooltip_text = `${items.value} Items`;
    }]],
    on_clicked: button => {
        revealer.revealChild = !revealer.revealChild;
        button.child.animate();
    },
    content: null,
    child: Widget.Icon({
        icon: icons.ui.arrow[direction],
        setup: icon => {
            icon._deg = 180;
            icon.animate = () => {
                const step = revealer.revealChild ? 10 : -10;
                for (let i = 0; i < 18; ++i) {
                    Utils.timeout(2 * i, () => {
                        icon._deg += step;
                        icon.setCss(`-gtk-icon-transform: rotate(${icon._deg}deg);`);
                    });
                }
            };
            icon.animate();
        },
    }),
});

export default ({ children, direction = 'left', items = Variable(0) }) => {
    const posStart = direction === 'up' || direction === 'left';
    const posEnd = direction === 'down' || direction === 'right';
    const revealer = Widget.Revealer({
        transition: `slide_${direction}`,
        child: Widget.Box({
            children,
        }),
    });

    return Widget.Box({
        vertical: direction === 'up' || direction === 'down',
        children: [
            posStart && revealer,
            Arrow(revealer, direction, items),
            posEnd && revealer,
        ],
    });
};
