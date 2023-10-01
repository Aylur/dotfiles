import icons from '../../icons.js';
import PanelButton from '../PanelButton.js';
import { Widget, Utils, Variable } from '../../imports.js';

const Arrow = (revealer, direction, items) => PanelButton({
    className: 'sub-menu',
    connections: [[items, btn => {
        btn.tooltipText = `${items.value} Items`;
    }]],
    onClicked: button => {
        const icon = button.child;
        revealer.revealChild = !revealer.revealChild;
        icon._animate(icon);
    },
    child: Widget.Icon({
        icon: icons.ui.arrow[direction],
        setup: i => i._animate(i),
        properties: [
            ['deg', 180],
            ['animate', icon => {
                const step = revealer.revealChild ? 10 : -10;
                for (let i = 0; i < 18; ++i) {
                    Utils.timeout(2 * i, () => {
                        icon._deg += step;
                        icon.setStyle(`-gtk-icon-transform: rotate(${icon._deg}deg);`);
                    });
                }
            }],
        ],
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
