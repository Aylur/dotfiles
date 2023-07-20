const { App, Widget } = ags;

Widget.widgets['dashboard/panel-button'] = ({ format = '%H:%M:%S  %A %d.', ...props }) => Widget({
    ...props,
    type: 'button',
    className: 'dashboard panel-button',
    onClick: () => App.toggleWindow('dashboard'),
    connections: [[App, (btn, win, visible) => {
        btn.toggleClassName('active', win === 'dashboard' && visible);
    }]],
    child: {
        format,
        type: 'clock',
    },
});

Widget.widgets['dashboard/popup-content'] = () => Widget({
    type: 'box',
    className: 'dashboard',
    vexpand: false,
    children: [
        {
            type: 'box',
            orientation: 'vertical',
            children: [
                {
                    type: 'datemenu/popup-content',
                    className: 'datemenu',
                },
            ],
        },
        {
            type: 'separator',
            vexpand: true,
        },
        {
            type: 'box',
            className: 'notifications',
            orientation: 'vertical',
            children: [
                {
                    type: 'notifications/header',
                    className: 'header',
                },
                {
                    type: 'box',
                    className: 'notification-list-box',
                    children: [{
                        type: 'wallpaper',
                        children: [{
                            type: 'notifications/list',
                            className: 'notification-list',
                            vexpand: true,
                            hexpand: true,
                        }],
                    }],
                },
            ],
        },
    ],
});
