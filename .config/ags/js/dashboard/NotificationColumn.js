import icons from '../icons.js';
import Wallpaper from '../misc/Wallpaper.js';
import Notification from '../misc/Notification.js';
const { Notifications } = ags.Service;
const { Button, Label, Box, Icon, Scrollable } = ags.Widget;

const ClearButton = () => Button({
    onClicked: Notifications.clear,
    connections: [[Notifications, button => {
        button.sensitive = Notifications.notifications.length > 0;
    }]],
    child: Box({
        children: [
            Label('Clear '),
            Icon({
                connections: [[Notifications, icon => {
                    icon.icon = Notifications.notifications.length > 0
                        ? icons.trash.full : icons.trash.empty;
                }]],
            }),
        ],
    }),
});

const Header = () => Box({
    className: 'header',
    children: [
        Label({ label: 'Notifications', hexpand: true, xalign: 0 }),
        ClearButton(),
    ],
});

const NotificationList = () => Box({
    vertical: true,
    vexpand: true,
    connections: [[Notifications, box => {
        box.children = Notifications.notifications
            .reverse()
            .map(n => Notification(n));

        box.visible = Notifications.notifications.length > 0;
    }]],
});

const Placeholder = () => Box({
    className: 'placeholder',
    vertical: true,
    valign: 'center',
    halign: 'center',
    vexpand: true,
    hexpand: true,
    children: [
        Icon(icons.notifications.silent),
        Label('Your inbox is empty'),
    ],
    connections: [[Notifications, box => {
        box.visible = Notifications.notifications.length === 0;
    }]],
});

export default () => Box({
    className: 'notifications',
    vertical: true,
    children: [
        Header(),
        Box({
            className: 'notification-wallpaper-box',
            children: [Wallpaper({
                children: [Scrollable({
                    className: 'notification-list-box',
                    hscroll: 'never',
                    vscroll: 'automatic',
                    child: Box({
                        className: 'notification-list',
                        vertical: true,
                        children: [
                            NotificationList(),
                            Placeholder(),
                        ],
                    }),
                })],
            })],
        }),
    ],
});
