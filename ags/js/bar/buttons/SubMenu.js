import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import Variable from 'resource:///com/github/Aylur/ags/variable.js';
import icons from '../../icons.js';

/**
 * @param {import('types/widgets/revealer').default} revealer
 * @param {any} direction
 * @param {any} items
 */
const Arrow = (revealer, direction, items) => Widget.Button({
    class_name: 'panel-button sub-menu',
    connections: [[items, btn => {
        btn.tooltip_text = `${items.value} Items`;
    }]],
    on_clicked: button => {
        revealer.reveal_child = !revealer.reveal_child;
        button.child.animate();
    },
    child: Widget.Icon({
        icon: icons.ui.arrow[direction],
        setup: icon => {
            icon._deg = 180;
            icon.animate = () => {
                const step = revealer.reveal_child ? 10 : -10;
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

/**
 * @param {Object} o
 * @param {import('types/widgets/box').default['children']} o.children
 * @param {'left' | 'right' | 'up' | 'down'=} o.direction
 * @param {import('types/variable').Variable} o.items
 */
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
