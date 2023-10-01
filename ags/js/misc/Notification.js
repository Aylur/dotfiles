import { Utils, Widget, Variable } from '../imports.js';
import GLib from 'gi://GLib';

const NotificationIcon = ({ appEntry, appIcon, image }) => {
    if (image) {
        return Widget.Box({
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
    if (Utils.lookUpIcon(appIcon))
        icon = appIcon;

    if (Utils.lookUpIcon(appEntry))
        icon = appEntry;

    return Widget.Box({
        valign: 'start',
        hexpand: false,
        className: 'icon',
        style: `
            min-width: 78px;
            min-height: 78px;
        `,
        children: [Widget.Icon({
            icon, size: 58,
            halign: 'center', hexpand: true,
            valign: 'center', vexpand: true,
        })],
    });
};

export default notification => {
    const hovered = Variable(false);

    const hover = () => {
        hovered.value = true;
        hovered._block = true;

        Utils.timeout(100, () => hovered._block = false);
    };

    const hoverLost = () => GLib.idle_add(0, () => {
        if (hovered._block)
            return GLib.SOURCE_REMOVE;

        hovered.value = false;
        notification.dismiss();
        return GLib.SOURCE_REMOVE;
    });

    const content = Widget.Box({
        className: 'content',
        children: [
            NotificationIcon(notification),
            Widget.Box({
                hexpand: true,
                vertical: true,
                children: [
                    Widget.Box({
                        children: [
                            Widget.Label({
                                className: 'title',
                                xalign: 0,
                                justification: 'left',
                                hexpand: true,
                                maxWidthChars: 24,
                                truncate: 'end',
                                wrap: true,
                                label: notification.summary,
                                useMarkup: notification.summary.startsWith('<'),
                            }),
                            Widget.Label({
                                className: 'time',
                                valign: 'start',
                                label: GLib.DateTime.new_from_unix_local(notification.time).format('%H:%M'),
                            }),
                            Widget.Button({
                                onHover: hover,
                                className: 'close-button',
                                valign: 'start',
                                child: Widget.Icon('window-close-symbolic'),
                                onClicked: () => notification.close(),
                            }),
                        ],
                    }),
                    Widget.Label({
                        className: 'description',
                        hexpand: true,
                        useMarkup: true,
                        xalign: 0,
                        justification: 'left',
                        label: notification.body,
                        wrap: true,
                    }),
                ],
            }),
        ],
    });

    const actionsbox = Widget.Revealer({
        transition: 'slide_down',
        binds: [['revealChild', hovered]],
        child: Widget.EventBox({
            onHover: hover,
            child: Widget.Box({
                className: 'actions',
                children: notification.actions.map(action => Widget.Button({
                    onHover: hover,
                    className: 'action-button',
                    onClicked: () => notification.invoke(action.id),
                    hexpand: true,
                    child: Widget.Label(action.label),
                })),
            }),
        }),
    });

    return Widget.EventBox({
        className: `notification ${notification.urgency}`,
        vexpand: false,
        onPrimaryClick: () => {
            hovered.value = false;
            notification.dismiss();
        },
        properties: [['hovered', hovered]],
        onHover: hover,
        onHoverLost: hoverLost,
        child: Widget.Box({
            vertical: true,
            children: [
                content,
                notification.actions.length > 0 && actionsbox,
            ],
        }),
    });
};
