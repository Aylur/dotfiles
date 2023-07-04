const { App, Widget } = ags;

const padding = windowName => ({
    type: 'eventbox',
    className: 'padding',
    hexpand: true,
    vexpand: true,
    onClick: () => App.toggleWindow(windowName),
});

const revealer = (windowName, transition, child) => Widget({
    type: 'box',
    style: 'padding: 1px;',
    children: [{
        type: 'revealer',
        transition, child,
        duration: 500,
        connections: [[App, (revealer, name, visible) => {
            if (name === windowName)
                revealer.reveal_child = visible;
        }]],
    }],
});

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
    'bottomleft': (windowName, child) => ({
        type: 'box',
        children: [
            {
                type: 'box',
                orientation: 'vertical',
                children: [
                    padding(windowName),
                    revealer(windowName, 'slide_up', child),
                ],
            },
            padding(windowName),
        ],
    }),
    'bottomright': (windowName, child) => ({
        type: 'box',
        children: [
            padding(windowName),
            {
                type: 'box',
                orientation: 'vertical',
                children: [
                    padding(windowName),
                    revealer(windowName, 'slide_left', child),
                ],
            },
        ],
    }),
};

Widget.widgets['layout'] = ({ layout, window, child }) => Widget(layouts[layout](window, child));
