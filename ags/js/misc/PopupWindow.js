import options from '../options.js';
import { App, Widget } from '../imports.js';

const Padding = windowName => Widget.EventBox({
    className: 'padding',
    hexpand: true,
    vexpand: true,
    connections: [['button-press-event', () => App.toggleWindow(windowName)]],
});

const PopupRevealer = (windowName, transition, child) => Widget.Box({
    style: 'padding: 1px;',
    children: [Widget.Revealer({
        transition,
        child,
        transitionDuration: options.windowAnimationDuration,
        connections: [[App, (revealer, name, visible) => {
            if (name === windowName)
                revealer.reveal_child = visible;
        }]],
    })],
});

const layouts = {
    'center': (windowName, child, expand) => Widget.CenterBox({
        className: 'shader',
        style: expand ? 'min-width: 5000px; min-height: 3000px;' : '',
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
    'bottom right': (windowName, child) => Widget.Box({
        children: [
            Padding(windowName),
            Widget.Box({
                hexpand: false,
                vertical: true,
                children: [
                    Padding(windowName),
                    PopupRevealer(windowName, 'slide_up', child),
                ],
            }),
        ],
    }),
};

export default ({
    layout = 'center',
    expand = true,
    name,
    content,
    ...rest
}) => Widget.Window({
    name,
    child: layouts[layout](name, content, expand),
    popup: true,
    focusable: true,
    ...rest,
});
