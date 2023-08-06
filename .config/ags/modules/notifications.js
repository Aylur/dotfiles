const { GLib } = imports.gi;
const { Notifications } = ags.Service;
const { lookUpIcon, timeout } = ags.Utils;
const { Widget } = ags;

const _icon = ({ appEntry, appIcon, image }) => {
    if (image) {
        return {
            type: 'box',
            className: 'icon img',
            style: `
                background-image: url("${image}");
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                min-width: 78px;
                min-height: 78px;
            `,
        };
    }

    let icon = 'dialog-information-symbolic';
    if (lookUpIcon(appIcon))
        icon = appIcon;

    if (lookUpIcon(appEntry))
        icon = appEntry;

    return {
        type: 'box',
        className: 'icon',
        style: `
            min-width: 78px;
            min-height: 78px;
        `,
        children: [{
            type: 'icon', icon, size: 58,
            halign: 'center', hexpand: true,
            valign: 'center', vexpand: true,
        }],
    };
};

const notification = ({ id, summary, body, actions, urgency, time, ...icon }) => Widget({
    type: 'eventbox',
    className: `notification ${urgency}`,
    onClick: () => Notifications.dismiss(id),
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
    child: {
        type: 'box',
        orientation: 'vertical',
        children: [
            {
                type: 'box',
                children: [
                    {
                        valign: 'start',
                        hexpand: false,
                        ..._icon(icon),
                    },
                    {
                        type: 'box',
                        hexpand: true,
                        orientation: 'vertical',
                        children: [
                            {
                                type: 'box',
                                children: [
                                    {
                                        className: 'title',
                                        xalign: 0,
                                        justify: 'left',
                                        hexpand: true,
                                        type: 'label',
                                        maxWidth: 24,
                                        wrap: true,
                                        label: summary,
                                        markup: summary.startsWith('<'),
                                    },
                                    {
                                        className: 'time',
                                        type: 'label',
                                        valign: 'start',
                                        label: GLib.DateTime.new_from_unix_local(time).format('%H:%M'),
                                    },
                                    {
                                        className: 'close-button',
                                        type: 'button',
                                        valign: 'start',
                                        child: Widget({ type: 'icon', icon: 'window-close-symbolic' }),
                                        onClick: () => Notifications.close(id),
                                    },
                                ],
                            },
                            {
                                className: 'description',
                                hexpand: true,
                                markup: true,
                                xalign: 0,
                                justify: 'left',
                                type: 'label',
                                label: body,
                                wrap: true,
                            },
                        ],
                    },
                ],
            },
            {
                type: 'box',
                className: 'actions',
                children: actions.map(action => ({
                    className: 'action-button',
                    type: 'button',
                    onClick: () => Notifications.invoke(id, action.id),
                    hexpand: true,
                    child: action.label,
                })),
            },
        ],
    },
});

Widget.widgets['notifications/notification-list'] = props => Widget({
    ...props,
    type: 'box',
    orientation: 'vertical',
    connections: [[Notifications, box => {
        box.get_children().forEach(ch => ch.destroy());
        for (const [, n] of Notifications.notifications)
            box.add(notification(n));

        box.show_all();
    }]],
});

Widget.widgets['notifications/popup-list'] = ({ transition = 'slide_down' }) => Widget({
    type: 'box',
    className: 'notifications-popup-list',
    style: 'padding: 1px',
    children: [
        {
            transition,
            type: 'revealer',
            connections: [[Notifications, revealer => {
                revealer.reveal_child = revealer.get_child()._map.size > 0;
            }]],
            child: {
                type: 'box',
                orientation: 'vertical',
                properties: [
                    ['map', new Map()],
                    ['dismiss', (box, id, force = false) => {
                        if (!id || !box._map.has(id))
                            return;

                        if (box._map.get(id)._hovered && !force)
                            return;

                        timeout(200, () => {
                            box._map.get(id).destroy();
                            box._map.delete(id);
                        });
                    }],
                    ['notify', (box, id) => {
                        if (!id)
                            return;

                        if (box._map.has(id))
                            box._map.get(id).destroy();

                        const widget = notification(Notifications.notifications.get(id));
                        box._map.set(id, widget);
                        box.add(widget);
                        box.show_all();
                    }],
                ],
                connections: [
                    [Notifications, (box, id) => box._notify(box, id), 'notified'],
                    [Notifications, (box, id) => box._dismiss(box, id), 'dismissed'],
                    [Notifications, (box, id) => box._dismiss(box, id, true), 'closed'],
                ],
            },
        },
    ],
});

Widget.widgets['notifications/placeholder'] = props => Widget({
    ...props,
    type: 'box',
    connections: [
        [Notifications, box => box.visible = Notifications.notifications.size === 0],
    ],
});

Widget.widgets['notifications/clear-button'] = props => Widget({
    ...props,
    type: 'button',
    onClick: Notifications.clear,
    connections: [[Notifications, button => button.sensitive = Notifications.notifications.size > 0]],
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
});

Widget.widgets['notifications/dnd-indicator'] = ({
    silent = Widget({ type: 'icon', icon: 'notifications-disabled-symbolic' }),
    noisy = Widget({ type: 'icon', icon: 'preferences-system-notifications-symbolic' }),
}) => Widget({
    type: 'dynamic',
    items: [
        { value: true, widget: silent },
        { value: false, widget: noisy },
    ],
    connections: [[Notifications, dynamic => {
        dynamic.update(value => value === Notifications.dnd);
    }]],
});

Widget.widgets['notifications/dnd-toggle'] = props => Widget({
    ...props,
    type: 'button',
    onClick: () => { Notifications.dnd = !Notifications.dnd; },
    connections: [[Notifications, button => {
        button.toggleClassName('on', Notifications.dnd);
    }]],
});
