import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import Variable from 'resource:///com/github/Aylur/ags/variable.js';
import icons from '../../icons.js';
import options from '../../options.js';

/**
 * @param {import('types/widgets/revealer').default} revealer
 * @param {'left' | 'right' | 'up' | 'down'} direction
 * @param {import('types/variable').Variable<number>} items
 */
const Arrow = (revealer, direction, items) => {
    let deg = 0;

    const icon = Widget.Icon({
        icon: icons.ui.arrow[direction],
    });

    const animate = () => {
        const t = options.transition.value / 20;
        const step = revealer.reveal_child ? 10 : -10;
        for (let i = 0; i < 18; ++i) {
            Utils.timeout(t * i, () => {
                deg += step;
                icon.setCss(`-gtk-icon-transform: rotate(${deg}deg);`);
            });
        }
    };

    return Widget.Button({
        class_name: 'panel-button sub-menu',
        tooltip_text: items.bind().transform(v => `${v} Items`),
        on_clicked: () => {
            animate();
            revealer.reveal_child = !revealer.reveal_child;
        },
        child: icon,
    });
};

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
