import icons from '../icons.js';
import { Utils, Widget, App, Variable } from '../imports.js';

export const opened = Variable('');
App.connect('window-toggled', (_, name, visible) => {
    if (name === 'quicksettings' && !visible)
        Utils.timeout(500, () => opened.value = '');
});

export const Arrow = (name, activate) => Widget.Button({
    child: Widget.Icon({
        icon: icons.ui.arrow.right,
        properties: [['deg', 0]],
        connections: [[opened, icon => {
            if (opened.value === name && !icon._opened || opened.value !== name && icon._opened) {
                const step = opened.value === name ? 10 : -10;
                icon._opened = !icon._opened;
                for (let i = 0; i < 9; ++i) {
                    Utils.timeout(15 * i, () => {
                        icon._deg += step;
                        icon.setCss(`-gtk-icon-transform: rotate(${icon._deg}deg);`);
                    });
                }
            }
        }]],
    }),
    on_clicked: () => {
        opened.value = opened.value === name ? '' : name;
        if (activate)
            activate();
    },
});

export const ArrowToggleButton = ({
    name, icon, label, activate, deactivate,
    activateOnArrow = true,
    connection: [service, condition],
}) => Widget.Box({
    class_name: 'toggle-button',
    connections: [[service, box => {
        box.toggleClassName('active', condition());
    }]],
    children: [
        Widget.Button({
            child: Widget.Box({
                hexpand: true,
                children: [icon, label],
            }),
            on_clicked: () => {
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

export const Menu = ({ name, icon, title, content }) => Widget.Revealer({
    transition: 'slide_down',
    connections: [[opened, revealer => {
        revealer.reveal_child = opened.value === name;
    }]],
    child: Widget.Box({
        class_name: 'menu',
        vertical: true,
        children: [
            Widget.Box({
                class_name: 'title',
                children: [icon, title],
            }),
            Widget.Separator(),
            Widget.Box({
                class_name: 'content',
                children: [content],
            }),
        ],
    }),
});

export const SimpleToggleButton = ({
    icon, label, toggle,
    connection: [service, condition],
}) => Widget.Button({
    class_name: 'simple-toggle',
    connections: [[service, box => {
        box.toggleClassName('active', condition());
    }]],
    child: Widget.Box({
        children: [icon, label],
    }),
    on_clicked: toggle,
});
