const { EventBox, CenterBox, Box, Revealer } = ags.Widget;
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
        transitionDuration: 350,
        connections: [[App, (revealer, name, visible) => {
            if (name === windowName)
                revealer.reveal_child = visible;
        }]],
    })],
});

const layouts = {
    'center': (windowName, child) => CenterBox({
        className: 'shader',
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

export const PopupLayout = ({ layout, window, child }) => layouts[layout](window, child);
