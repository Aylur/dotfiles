const { Widget } = ags;
const { Notifications } = ags.Service;
const { timeout } = ags.Utils;

Widget.widgets['notifications/header'] = props => Widget({
    ...props,
    type: 'box',
    vexpand: true,
    children: [
        { type: 'label', label: 'Notifications', hexpand: true, xalign: 0 },
        {
            type: 'notifications/clear-button',
            child: {
                type: 'box',
                children: [
                    'Clear ',
                    {
                        type: 'dynamic',
                        items: [
                            { value: true, widget: { type: 'icon', icon: 'user-trash-full-symbolic' } },
                            { value: false, widget: { type: 'icon', icon: 'user-trash-symbolic' } },
                        ],
                        connections: [
                            [Notifications, dynamic => dynamic.update(value => {
                                return value === Notifications.notifications.size > 0;
                            })],
                        ],
                    },
                ],
            },
        },
    ],
});

Widget.widgets['notifications/list'] = props => Widget({
    ...props,
    hscroll: 'never',
    vscroll: 'automatic',
    type: 'scrollable',
    child: {
        type: 'box',
        orientation: 'vertical',
        vexpand: true,
        children: [
            { type: 'notifications/notification-list' },
            {
                type: 'notifications/placeholder',
                className: 'placeholder',
                orientation: 'vertical',
                valign: 'center',
                vexpand: true,
                children: [
                    { type: 'icon', icon: 'notifications-disabled-symbolic', size: 78 },
                    'Your inbox is empty',
                ],
            },
        ],
    },
});

Widget.widgets['notifications/popup-content'] = () => Widget({
    type: 'box',
    className: 'notifications',
    vexpand: true,
    orientation: 'vertical',
    children: [
        {
            type: 'notifications/header',
            className: 'header',
        },
        {
            type: 'box',
            vexpand: true,
            children: [{
                type: 'notifications/list',
                className: 'notification-list',
            }],
        },
    ],
});

Widget.widgets['notifications/popups'] = ({ transition }) => Widget({
    type: 'box',
    style: 'padding: 1px;',
    children: [{
        type: 'revealer',
        transition,
        style: 'border: 1px solid red; padding: 5px;',
        connections: [[Notifications, revealer => {
            revealer.reveal_child = Notifications.popups.size > 0;
        }]],
        child: {
            type: 'notifications/popup-list',
            className: 'notification-popup',
        },
    }],
});

Widget.widgets['notifications/indicator'] = props => Widget({
    ...props,
    type: 'notifications/dnd-indicator',
    connections: [[Notifications, indicator => {
        const notified = Notifications.notifications.size > 0;
        indicator.toggleClassName(notified, 'notified');
        indicator.visible = notified || Notifications.dnd;
    }]],
});

Widget.widgets['notifications/popup-label'] = ({ transition = 'slide_left', ...props }) => Widget({
    ...props,
    type: 'box',
    style: 'padding: 1px;',
    children: [{
        type: 'revealer',
        transition,
        connections: [[Notifications, revaler => {
            revaler.reveal_child = Notifications.popups.size > 0;
        }]],
        child: {
            type: 'label',
            connections: [[Notifications, label => {
                const lbl = Array.from(Notifications.notifications.values()).pop()?.summary;
                label.label = lbl || '';
            }]],
        },
    }],
});

Widget.widgets['notifications/popup-indicator'] = ({ direction = 'left', ...props }) => Widget({
    ...props,
    type: 'box',
    children: [{
        type: 'eventbox',
        onHover: box => {
            timeout(200, () => box._revealed = true);
            box.get_child().get_children()[direction === 'left' ? 0 : 1].get_children()[0].reveal_child = true;
        },
        onHoverLost: box => {
            if (!box._revealed)
                return;

            timeout(200, () => box._revealed = false);
            box.get_child().get_children()[direction === 'left' ? 0 : 1].get_children()[0].reveal_child = false;
        },
        child: {
            type: 'box',
            children: direction === 'left'
                ? [
                    { type: 'notifications/popup-label', transition: 'slide_left' },
                    { type: 'notifications/indicator' },
                ]
                : [
                    { type: 'notifications/indicator' },
                    { type: 'notifications/popup-label', transition: 'slide_right' },
                ],
        },
    }],
});
