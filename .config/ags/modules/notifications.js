const { GLib } = imports.gi;
const { Notifications } = ags.Service;
const { lookUpIcon } = ags.Utils;
const { Widget } = ags;

const _icon = ({ appEntry, appIcon, image }) => {
    if (image) {
        return {
            type: 'box',
            style: `
                background-image: url("${image}");
                background-size: contain;
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

const _notification = ({ id, summary, body, actions, urgency, time, ...icon }) => Widget({
    type: 'eventbox',
    className: `notification ${urgency}`,
    onClick: () => Notifications.dismiss(id),
    child: Widget({
        type: 'box',
        orientation: 'vertical',
        children: [
            Widget({
                type: 'box',
                children: [
                    Widget({
                        className: 'icon',
                        valign: 'start',
                        ..._icon(icon),
                    }),
                    Widget({
                        type: 'box',
                        hexpand: true,
                        orientation: 'vertical',
                        children: [
                            Widget({
                                type: 'box',
                                children: [
                                    Widget({
                                        className: 'title',
                                        xalign: 0,
                                        hexpand: true,
                                        type: 'label',
                                        label: summary.length > 24 ? summary.substring(0, 24)+'..' : summary,
                                    }),
                                    Widget({
                                        className: 'time',
                                        type: 'label',
                                        label: GLib.DateTime.new_from_unix_local(time).format('%H:%M'),
                                    }),
                                    Widget({
                                        className: 'close-button',
                                        type: 'button',
                                        child: Widget({ type: 'icon', icon: 'window-close-symbolic' }),
                                        onClick: () => Notifications.close(id),
                                    }),
                                ],
                            }),
                            Widget({
                                className: 'description',
                                hexpand: true,
                                markup: true,
                                xalign: 0,
                                justify: 'left',
                                type: 'label',
                                label: body,
                                wrap: true,
                            }),
                        ],
                    }),
                ],
            }),
            Widget({
                type: 'box',
                className: 'actions',
                connections: [['draw', widget => { widget.visible = actions.length > 0; }]],
                children: actions.map(({ action, label }) => ({
                    className: 'action-button',
                    type: 'button',
                    onClick: () => Notifications.invoke(id, action),
                    hexpand: true,
                    child: label,
                })),
            }),
        ],
    }),
});

const _list = (map, { notification = _notification, ...rest }) => Widget({
    ...rest,
    type: 'box',
    orientation: 'vertical',
    connections: [[Notifications, box => {
        box.get_children().forEach(ch => ch.destroy());
        for (const [, n] of Notifications[map])
            box.add(notification(n));

        box.show_all();
    }]],
});

Widget.widgets['notifications/notification-list'] = props => _list('notifications', props);
Widget.widgets['notifications/popup-list'] = props => _list('popups', props);

Widget.widgets['notifications/placeholder'] = props => Widget({
    ...props,
    type: 'box',
    connections: [
        [Notifications, box => box.visible = Notifications.notifications.size > 0],
        ['draw', box => box.visible = Notifications.notifications.size > 0],
    ],
});

Widget.widgets['notifications/clear-button'] = props => Widget({
    ...props,
    type: 'button',
    onClick: Notifications.clear,
});

Widget.widgets['notifications/dnd-indicator'] = ({
    silent = Widget({ type: 'icon', icon: 'notifications-disabled-symbolic' }),
    noisy = Widget({ type: 'icon', icon: 'preferences-system-notifications-symbolic' }),
    ...rest
}) => Widget({
    ...rest,
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
        button.toggleClassName(Notifications.dnd, 'on');
    }]],
});
