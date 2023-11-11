import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Variable from 'resource:///com/github/Aylur/ags/variable.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import icons from '../icons.js';

/** name of the currently opened menu  */
export const opened = Variable('');
App.connect('window-toggled', (_, name, visible) => {
    if (name === 'quicksettings' && !visible)
        Utils.timeout(500, () => opened.value = '');
});

/**
 * @param {string} name - menu name
 * @param {(() => void) | false=} activate
 */
export const Arrow = (name, activate) => {
    let deg = 0;
    let iconOpened = false;
    return Widget.Button({
        child: Widget.Icon({
            icon: icons.ui.arrow.right,
            connections: [[opened, icon => {
                if (opened.value === name && !iconOpened || opened.value !== name && iconOpened) {
                    const step = opened.value === name ? 10 : -10;
                    iconOpened = !iconOpened;
                    for (let i = 0; i < 9; ++i) {
                        Utils.timeout(15 * i, () => {
                            deg += step;
                            icon.setCss(`-gtk-icon-transform: rotate(${deg}deg);`);
                        });
                    }
                }
            }]],
        }),
        on_clicked: () => {
            opened.value = opened.value === name ? '' : name;
            if (typeof activate === 'function')
                activate();
        },
    });
};

/**
 * @param {Object} o
 * @param {string} o.name - menu name
 * @param {import('gi://Gtk').Gtk.Widget} o.icon
 * @param {import('gi://Gtk').Gtk.Widget} o.label
 * @param {() => void} o.activate
 * @param {() => void} o.deactivate
 * @param {boolean=} o.activateOnArrow
 * @param {[import('gi://GObject').GObject.Object, () => boolean]} o.connection
 */
export const ArrowToggleButton = ({
    name,
    icon,
    label,
    activate,
    deactivate,
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
                class_name: 'label-box horizontal',
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

/**
 * @param {Object} o
 * @param {string} o.name - menu name
 * @param {import('gi://Gtk').Gtk.Widget} o.icon
 * @param {import('gi://Gtk').Gtk.Widget} o.title
 * @param {import('gi://Gtk').Gtk.Widget[]} o.content
 */
export const Menu = ({ name, icon, title, content }) => Widget.Revealer({
    transition: 'slide_down',
    binds: [['reveal-child', opened, 'value', v => v === name]],
    child: Widget.Box({
        class_names: ['menu', name],
        vertical: true,
        children: [
            Widget.Box({
                class_name: 'title horizontal',
                children: [icon, title],
            }),
            Widget.Separator(),
            ...content,
        ],
    }),
});

/**
 * @param {Object} o
 * @param {import('gi://Gtk').Gtk.Widget} o.icon
 * @param {() => void} o.toggle
 * @param {[import('gi://GObject').GObject.Object, () => boolean]} o.connection
 */
export const SimpleToggleButton = ({
    icon,
    toggle,
    connection: [service, condition],
}) => Widget.Button({
    class_name: 'simple-toggle',
    connections: [[service, box => {
        box.toggleClassName('active', condition());
    }]],
    child: icon,
    on_clicked: toggle,
});
