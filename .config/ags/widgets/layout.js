const { App, Widget } = ags;

const padding = windowName => ({
    type: 'eventbox',
    className: 'padding',
    hexpand: true,
    vexpand: true,
    onClick: () => App.toggleWindow(windowName),
});

const revealer = (windowName, transition, child) => {
    const reveal = Widget({
        type: 'revealer',
        transition, child,
        duration: 500,
        connections: [[App, App.connect('window-toggled', (_app, name, visible) => {
            if (name === windowName)
                reveal.reveal_child = visible;
        })]],
    });

    return Widget({
        type: 'box',
        style: 'padding: 1px;',
        children: [reveal],
    });
};

const layouts = {
    'center': (windowName, child) => ({
        type: 'centerbox',
        className: 'shader',
        children: [
            padding(windowName),
            {
                type: 'centerbox',
                orientation: 'vertical',
                children: [
                    padding(windowName),
                    child,
                    padding(windowName),
                ],
            },
            padding(windowName),
        ],
    }),
    'top': (windowName, child) => ({
        type: 'centerbox',
        children: [
            padding(windowName),
            {
                type: 'box',
                orientation: 'vertical',
                children: [
                    revealer(windowName, 'slide_down', child),
                    padding(windowName),
                ],
            },
            padding(windowName),
        ],
    }),
    'right': (windowName, child) => ({
        type: 'box',
        children: [
            padding(windowName),
            revealer(windowName, 'slide_left', child),
        ],
    }),
    'topleft': (windowName, child) => ({
        type: 'box',
        children: [
            {
                type: 'box',
                orientation: 'vertical',
                children: [
                    revealer(windowName, 'slide_down', child),
                    padding(windowName),
                ],
            },
            padding(windowName),
        ],
    }),
    'topright': (windowName, child) => ({
        type: 'box',
        children: [
            padding(windowName),
            {
                type: 'box',
                orientation: 'vertical',
                children: [
                    revealer(windowName, 'slide_down', child),
                    padding(windowName),
                ],
            },
        ],
    }),
};

Widget.widgets['layout'] = ({ layout, window, child }) => Widget(layouts[layout](window, child));
