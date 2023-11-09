import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import options from '../options.js';

/** @param {string} windowName */
const Padding = windowName => Widget.EventBox({
    class_name: 'padding',
    hexpand: true,
    vexpand: true,
    connections: [['button-press-event', () => App.toggleWindow(windowName)]],
});

/**
 * @param {string} windowName
 * @param {import('types/widgets/revealer').RevealerProps['transition']} transition
 * @param {import('types/widgets/box').default} child
 */
const PopupRevealer = (windowName, transition, child) => Widget.Box({
    css: 'padding: 1px;',
    child: Widget.Revealer({
        transition,
        child,
        transitionDuration: options.windowAnimationDuration,
        connections: [[App, (revealer, name, visible) => {
            if (name === windowName)
                revealer.reveal_child = visible;
        }]],
    }),
});

const layouts = {
    'center': (windowName, child, expand) => Widget.CenterBox({
        class_name: 'shader',
        css: expand ? 'min-width: 5000px; min-height: 3000px;' : '',
        children: [
            Padding(windowName),
            Widget.CenterBox({
                vertical: true,
                children: [
                    Padding(windowName),
                    child,
                    Padding(windowName),
                ],
            }),
            Padding(windowName),
        ],
    }),
    'top': (windowName, child) => Widget.CenterBox({
        children: [
            Padding(windowName),
            Widget.Box({
                vertical: true,
                children: [
                    PopupRevealer(windowName, 'slide_down', child),
                    Padding(windowName),
                ],
            }),
            Padding(windowName),
        ],
    }),
    'top right': (windowName, child) => Widget.Box({
        children: [
            Padding(windowName),
            Widget.Box({
                hexpand: false,
                vertical: true,
                children: [
                    PopupRevealer(windowName, 'slide_down', child),
                    Padding(windowName),
                ],
            }),
        ],
    }),
};


/**
 * @typedef {Object} PopopWindowProps
 * @property {import('types/widgets/box').default} content
 * @property {'center' | 'top' | 'top right'=} layout
 * @property {boolean=} expand
 */

/** @param {import('types/widgets/window').WindowProps & PopopWindowProps} o */
export default ({
    layout = 'center',
    expand = true,
    name,
    content,
    ...rest
}) => Widget.Window({
    name,
    popup: true,
    visible: false,
    focusable: true,
    setup(self) {
        content.toggleClassName('content');
        self.child = layouts[layout](name, content, expand);
    },
    ...rest,
});
