const { Widget } = ags;
const { Notifications } = ags.Service;

Widget.widgets['notifications/quicksettings'] = () => Widget({
    type: 'box',
    className: 'notifications',
    vexpand: true,
    orientation: 'vertical',
    children: [
        {
            type: 'box',
            className: 'header',
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
                                ]
                            },
                        ],
                    },
                },
            ],
        },
        {
            type: 'scrollable',
            vexpand: true,
            className: 'notification-list',
            hscroll: 'never',
            vscroll: 'automatic',
            child: {
                type: 'box',
                orientation: 'vertical',
                children: [
                    { type: 'notifications/notification-list' },
                    {
                        type: 'notifications/placeholder',
                        orientation: 'vertical',
                        valign: 'center',
                        vexpand: true,
                        children: [
                            { type: 'icon', icon: 'notifications-disabled-symbolic', size: 78 },
                            'Your inbox is empty'
                        ]
                    }
                ]
            },
        },
    ],
});

Widget.widgets['notifications/popups'] = () => Widget({
    type: 'box',
    style: 'padding: 1px;',
    children: [{
        type: 'revealer',
        transition: 'slide_down',
        style: 'border: 1px solid red; padding: 5px;',
        connections: [[Notifications, revealer => {
            revealer.reveal_child = Notifications.popups.size > 0;
        }]],
        child: {
            type: 'notifications/popup-list',
            className: 'notification-popup',
        }
    }]
});

Widget.widgets['notifications/indicator'] = props => Widget({
    ...props,
    type: 'notifications/dnd-indicator',
    connections: [[Notifications, indicator => {
        const notified = Notifications.notifications.size > 0;
        indicator.toggleClassName(notified, 'notified');
        indicator.visible = notified || Notifications.dnd;
    }]],
})

Widget.widgets['notifications/popup-label'] = props => Widget({
    ...props,
    type: 'box',
    className: 'notification',
    style: 'padding: 1px;',
    children: [{
        type: 'revealer',
        transition: 'slide_left',
        connections: [[Notifications, revaler => {
            revaler.reveal_child = Notifications.popups.size > 0;
        }]],
        child: {
            type: 'label',
            connections: [[Notifications, label => {
                const lbl = Array.from(Notifications.popups.values()).pop()?.summary;
                label.label = lbl ? lbl : label.label;
            }]],
        },
    }],
});
