const { GLib } = imports.gi;
const { Notifications } = ags.Service;
const { lookUpIcon, timeout } = ags.Utils;
const { Box, Icon, Label, EventBox, Button, Stack, Revealer } = ags.Widget;

const NotificationIcon = ({ appEntry, appIcon, image }) => {
    if (image) {
        return Box({
            valign: 'start',
            hexpand: false,
            className: 'icon img',
            style: `
                background-image: url("${image}");
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                min-width: 78px;
                min-height: 78px;
            `,
        });
    }

    let icon = 'dialog-information-symbolic';
    if (lookUpIcon(appIcon))
        icon = appIcon;

    if (lookUpIcon(appEntry))
        icon = appEntry;

    return Box({
        valign: 'start',
        hexpand: false,
        className: 'icon',
        style: `
            min-width: 78px;
            min-height: 78px;
        `,
        children: [Icon({
            icon, size: 58,
            halign: 'center', hexpand: true,
            valign: 'center', vexpand: true,
        })],
    });
};

const Notification = ({ id, summary, body, actions, urgency, time, ...icon }) => EventBox({
    className: `notification ${urgency}`,
    onPrimaryClick: () => Notifications.dismiss(id),
    properties: [['hovered', false]],
    onHover: w => {
        if (w._hovered)
            return;

        timeout(300, () => w._hovered = true);
    },
    onHoverLost: w => {
        if (!w._hovered)
            return;

        w._hovered = false;
        Notifications.dismiss(id);
    },
    vexpand: false,
    child: Box({
        vertical: true,
        children: [
            Box({
                children: [
                    NotificationIcon(icon),
                    Box({
                        hexpand: true,
                        vertical: true,
                        children: [
                            Box({
                                children: [
                                    Label({
                                        className: 'title',
                                        xalign: 0,
                                        justification: 'left',
                                        hexpand: true,
                                        maxWidthChars: 24,
                                        ellipsize: 3,
                                        wrap: true,
                                        label: summary,
                                        useMarkup: summary.startsWith('<'),
                                    }),
                                    Label({
                                        className: 'time',
                                        valign: 'start',
                                        label: GLib.DateTime.new_from_unix_local(time).format('%H:%M'),
                                    }),
                                    Button({
                                        className: 'close-button',
                                        valign: 'start',
                                        child: Icon('window-close-symbolic'),
                                        onClicked: () => Notifications.close(id),
                                    }),
                                ],
                            }),
                            Label({
                                className: 'description',
                                hexpand: true,
                                useMarkup: true,
                                xalign: 0,
                                justification: 'left',
                                label: body,
                                wrap: true,
                            }),
                        ],
                    }),
                ],
            }),
            Box({
                className: 'actions',
                children: actions.map(action => Button({
                    className: 'action-button',
                    onClicked: () => Notifications.invoke(id, action.id),
                    hexpand: true,
                    child: Label(action.label),
                })),
            }),
        ],
    }),
});

export const NotificationList = props => Box({
    ...props,
    vertical: true,
    vexpand: true,
    className: 'notification-list',
    connections: [[Notifications, box => {
        box.children = Array.from(Notifications.notifications.values())
            .map(n => Notification(n));

        box.visible = Notifications.notifications.size > 0;
    }]],
});

export const PopupList = ({ transition = 'slide_down' } = {}) => Box({
    className: 'notifications-popup-list',
    style: 'padding: 1px',
    children: [
        Revealer({
            transition,
            child: Box({
                vertical: true,
                properties: [
                    ['map', new Map()],
                    ['dismiss', (box, id, force = false) => {
                        if (!id || !box._map.has(id))
                            return;

                        if (box._map.get(id)._hovered && !force)
                            return;

                        if (box._map.size - 1 === 0)
                            box.get_parent().reveal_child = false;

                        timeout(200, () => {
                            box._map.get(id)?.destroy();
                            box._map.delete(id);
                        });
                    }],
                    ['notify', (box, id) => {
                        if (!id)
                            return;

                        if (box._map.has(id))
                            box._map.get(id).destroy();

                        const widget = Notification(Notifications.notifications.get(id));
                        box._map.set(id, widget);
                        box.add(widget);
                        box.show_all();

                        timeout(10, () => {
                            box.get_parent().reveal_child = true;
                        });
                    }],
                ],
                connections: [
                    [Notifications, (box, id) => box._notify(box, id), 'notified'],
                    [Notifications, (box, id) => box._dismiss(box, id), 'dismissed'],
                    [Notifications, (box, id) => box._dismiss(box, id, true), 'closed'],
                ],
            }),
        }),
    ],
});

export const Placeholder = props => Box({
    className: 'placeholder',
    vertical: true,
    valign: 'center',
    vexpand: true,
    halign: 'center',
    hexpand: true,
    ...props,
    children: [
        Label({ label: '󰂛', className: 'icon' }),
        Label('Your inbox is empty'),
    ],
    connections: [
        [Notifications, box => box.visible = Notifications.notifications.size === 0],
    ],
});

export const ClearButton = props => Button({
    ...props,
    onClicked: Notifications.clear,
    connections: [[Notifications, button => button.sensitive = Notifications.notifications.size > 0]],
    child: Box({
        children: [
            Label('Clear '),
            Stack({
                items: [
                    ['true', Icon('user-trash-full-symbolic')],
                    ['false', Icon('user-trash-symbolic')],
                ],
                connections: [[Notifications, stack => {
                    stack.shown = `${Notifications.notifications.size > 0}`;
                }]],
            }),
        ],
    }),
});

export const DNDIndicator = ({
    silent = Icon('notifications-disabled-symbolic'),
    noisy = Icon('preferences-system-notifications-symbolic'),
} = {}) => Stack({
    items: [
        ['true', silent],
        ['false', noisy],
    ],
    connections: [[Notifications, stack => {
        stack.shown = `${Notifications.dnd}`;
    }]],
});

export const DNDToggle = props => Button({
    ...props,
    onClicked: () => { Notifications.dnd = !Notifications.dnd; },
    connections: [[Notifications, button => {
        button.toggleClassName('on', Notifications.dnd);
    }]],
});
