import options from '../options.js';

const { EventBox, CenterBox, Box, Revealer, Window } = ags.Widget;
const { App } = ags;

const Padding = windowName => EventBox({
    className: 'padding',
    hexpand: true,
    vexpand: true,
    connections: [['button-press-event', () => App.toggleWindow(windowName)]],
});

const PopupRevealer = (windowName, transition, child) => Box({
    style: 'padding: 1px;',
    children: [Revealer({
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
    'center': (windowName, child, expand) => CenterBox({
        className: 'shader',
        style: expand ? 'min-width: 5000px; min-height: 3000px;' : '',
        children: [
            Padding(windowName),
            CenterBox({
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
    'top': (windowName, child) => CenterBox({
        children: [
            Padding(windowName),
            Box({
                vertical: true,
                children: [
                    PopupRevealer(windowName, 'slide_down', child),
                    Padding(windowName),
                ],
            }),
            Padding(windowName),
        ],
    }),
    'top right': (windowName, child) => Box({
        children: [
            Padding(windowName),
            Box({
                hexpand: false,
                vertical: true,
                children: [
                    PopupRevealer(windowName, 'slide_down', child),
                    Padding(windowName),
                ],
            }),
        ],
    }),
    'bottom right': (windowName, child) => Box({
        children: [
            Padding(windowName),
            Box({
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

export default ({ layout = 'center', expand = true, name, content, ...rest }) => Window({
    name,
    child: layouts[layout](name, content, expand),
    popup: true,
    focusable: true,
    ...rest,
});
