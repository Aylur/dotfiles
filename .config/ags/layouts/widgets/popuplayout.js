const { App, Widget } = ags;

const padding = windowName => ({
    type: 'eventbox',
    className: 'padding',
    hexpand: true,
    vexpand: true,
    onClick: () => App.toggleWindow(windowName),
});

const revealer = (windowName, transition, child) => ({
    type: 'box',
    style: 'padding: 1px;',
    children: [{
        type: 'revealer',
        transition,
        child,
        duration: 350,
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
    'topright': (windowName, child) => ({
        type: 'box',
        children: [
            padding(windowName),
            {
                type: 'box',
                hexpand: false,
                orientation: 'vertical',
                children: [
                    revealer(windowName, 'slide_down', child),
                    padding(windowName),
                ],
            },
        ],
    }),
    'bottomright': (windowName, child) => ({
        type: 'box',
        children: [
            padding(windowName),
            {
                type: 'box',
                hexpand: false,
                orientation: 'vertical',
                children: [
                    padding(windowName),
                    revealer(windowName, 'slide_up', child),
                ],
            },
        ],
    }),
};

Widget.widgets['layout'] = ({ layout, window, child }) => Widget(layouts[layout](window, child));
