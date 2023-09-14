import icons from '../icons.js';
import Separator from '../misc/Separator.js';
const { timeout } = ags.Utils;
const { Box, Button, Icon, Revealer } = ags.Widget;

export const opened = ags.Variable('');
ags.App.instance.connect('window-toggled', (_, name, visible) => {
    if (name === 'quicksettings' && !visible)
        timeout(500, () => opened.value = '');
});

export const Arrow = (name, activate) => Button({
    child: Icon({
        icon: icons.ui.arrow.right,
        properties: [['deg', 0]],
        connections: [[opened, icon => {
            if (opened.value === name && !icon._opened || opened.value !== name && icon._opened) {
                const step = opened.value === name ? 10 : -10;
                icon._opened = !icon._opened;
                for (let i = 0; i < 9; ++i) {
                    timeout(15 * i, () => {
                        icon._deg += step;
                        icon.setStyle(`-gtk-icon-transform: rotate(${icon._deg}deg);`);
                    });
                }
            }
        }]],
    }),
    onClicked: () => {
        opened.value = opened.value === name ? '' : name;
        if (activate)
            activate();
    },
});

export const ArrowToggleButton = ({
    name, icon, label, activate, deactivate,
    activateOnArrow = true,
    connection: [service, condition],
}) => Box({
    className: 'toggle-button',
    connections: [[service, box => {
        box.toggleClassName('active', condition());
    }]],
    children: [
        Button({
            child: Box({
                hexpand: true,
                children: [icon, label],
            }),
            onClicked: () => {
                if (condition()) {
                    deactivate();
                    if (opened.value === name)
                        opened.value = '';
                } else {
                    activate();
                }
            },
        }),
        Arrow(name, activateOnArrow && activate),
    ],
});

export const Menu = ({ name, icon, title, content }) => Revealer({
    transition: 'slide_down',
    connections: [[opened, revealer => {
        revealer.revealChild = opened.value === name;
    }]],
    child: Box({
        className: 'menu',
        vertical: true,
        children: [
            Box({
                className: 'title',
                children: [icon, title],
            }),
            Separator({ orientation: 'horizontal' }),
            Box({
                className: 'content',
                children: [content],
            }),
        ],
    }),
});

export const SimpleToggleButton = ({
    icon, label, toggle,
    connection: [service, condition],
}) => Button({
    className: 'simple-toggle',
    connections: [[service, box => {
        box.toggleClassName('active', condition());
    }]],
    child: Box({
        children: [icon, label],
    }),
    onClicked: toggle,
});
