import icons from '../icons.js';
import Notification from '../misc/Notification.js';
import { Widget, Notifications } from '../imports.js';

const ClearButton = () => Widget.Button({
    on_clicked: () => Notifications.clear(),
    binds: [['sensitive', Notifications, 'notifications', n => n.length > 0]],
    child: Widget.Box({
        children: [
            Widget.Label('Clear '),
            Widget.Icon({
                binds: [['icon', Notifications, 'notifications', n =>
                    n.length > 0 ? icons.trash.full : icons.trash.empty]],
            }),
        ],
    }),
});

const Header = () => Widget.Box({
    class_name: 'header',
    children: [
        Widget.Label({ label: 'Notifications', hexpand: true, xalign: 0 }),
        ClearButton(),
    ],
});

const NotificationList = () => Widget.Box({
    vertical: true,
    vexpand: true,
    connections: [[Notifications, box => {
        box.children = Notifications.notifications
            .reverse().map(Notification);

        box.visible = Notifications.notifications.length > 0;
    }]],
});

const Placeholder = () => Widget.Box({
    class_name: 'placeholder',
    vertical: true,
    vpack: 'center',
    hpack: 'center',
    vexpand: true,
    hexpand: true,
    children: [
        Widget.Icon(icons.notifications.silent),
        Widget.Label('Your inbox is empty'),
    ],
    binds: [['visible', Notifications, 'notifications', n => n.length === 0]],
});

export default () => Widget.Box({
    class_name: 'notifications',
    vertical: true,
    children: [
        Header(),
        Widget.Scrollable({
            vexpand: true,
            class_name: 'notification-scrollable',
            hscroll: 'never',
            vscroll: 'automatic',
            child: Widget.Box({
                class_name: 'notification-list',
                vertical: true,
                children: [
                    NotificationList(),
                    Placeholder(),
                ],
            }),
        }),
    ],
});
