import icons from '../../icons.js';
import PanelButton from '../PanelButton.js';
const { Icon, Box, Revealer } = ags.Widget;

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
    child: Icon({
        icon: icons.ui.arrow[direction],
        setup: i => i._animate(i),
        properties: [
            ['deg', 180],
            ['animate', icon => {
                const step = revealer.revealChild ? 10 : -10;
                for (let i = 0; i < 18; ++i) {
                    ags.Utils.timeout(2 * i, () => {
                        icon._deg += step;
                        icon.setStyle(`-gtk-icon-transform: rotate(${icon._deg}deg);`);
                    });
                }
            }],
        ],
    }),
});

export default ({ children, direction = 'left', items = ags.Variable(0) }) => {
    const posStart = direction === 'up' || direction === 'left';
    const posEnd = direction === 'down' || direction === 'right';
    const revealer = Revealer({
        transition: `slide_${direction}`,
        child: Box({
            children,
        }),
    });

    return Box({
        vertical: direction === 'up' || direction === 'down',
        children: [
            posStart && revealer,
            Arrow(revealer, direction, items),
            posEnd && revealer,
        ],
    });
};
