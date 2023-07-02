const { App, Widget } = ags;
const { Notifications } = ags.Service;

Widget.widgets['dashboard/panel-button'] = props => Widget({
    ...props,
    type: 'button',
    className: 'dashboard',
    onClick: () => App.toggleWindow('dashboard'),
    child: {
        format: '%H:%M:%S  %A %d.',
        type: 'clock',
    },
});

Widget.widgets['dashboard/media-indicator'] = props => Widget({
    ...props,
    className: 'media-indicator',
    type: 'box',
    halign: 'end',
    children: [
        {
            type: 'media/indicator',
            className: 'indicator',
        },
        {
            type: 'mpris/box',
            className: 'separator',
            valign: 'center',
            player: imports.widgets.media.prefer('spotify'),
        },
    ],
});

Widget.widgets['dashboard/notifications-indicator'] = props => Widget({
    ...props,
    type: 'box',
    className: 'notifications-indicator',
    children: [
        {
            type: 'box',
            className: 'separator',
            valign: 'center',
            connections: [[Notifications, box => {
                box.visible = Notifications.notifications.size > 0;
            }]],
        },
        {
            type: 'notifications/popup-indicator',
            className: 'indicator',
            direction: 'right',
        },
    ],
});

Widget.widgets['dashboard/popup-content'] = () => Widget({
    type: 'box',
    className: 'dashboard',
    children: [
        {
            type: 'box',
            orientation: 'vertical',
            children: [
                {
                    type: 'datemenu/popup-content',
                    className: 'datemenu',
                },
                {
                    type: 'media/popup-content',
                    className: 'media',
                    orientation: 'vertical',
                },
            ],
        },
        {
            type: 'box',
            className: 'separator',
        },
        {
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
                    type: 'overlay',
                    vexpand: true,
                    children: [
                        { type: 'wallpaper' },
                        {
                            type: 'notifications/list',
                            className: 'notification-list',
                        },
                    ],
                },
            ],
        },
    ],
});
