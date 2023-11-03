import { Utils, Widget, Variable } from '../imports.js';
import GLib from 'gi://GLib';

const NotificationIcon = ({ appEntry, appIcon, image }) => {
    if (image) {
        return Widget.Box({
            vpack: 'start',
            hexpand: false,
            class_name: 'icon img',
            css: `
                background-image: url("${image}");
                background-size: cover;
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
        vpack: 'start',
        hexpand: false,
        class_name: 'icon',
        css: `
            min-width: 78px;
            min-height: 78px;
        `,
        child: Widget.Icon({
            icon, size: 58,
            hpack: 'center', hexpand: true,
            vpack: 'center', vexpand: true,
        }),
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
        class_name: 'content',
        children: [
            NotificationIcon(notification),
            Widget.Box({
                hexpand: true,
                vertical: true,
                children: [
                    Widget.Box({
                        children: [
                            Widget.Label({
                                class_name: 'title',
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
                                class_name: 'time',
                                vpack: 'start',
                                label: GLib.DateTime.new_from_unix_local(notification.time).format('%H:%M'),
                            }),
                            Widget.Button({
                                onHover: hover,
                                class_name: 'close-button',
                                vpack: 'start',
                                child: Widget.Icon('window-close-symbolic'),
                                onClicked: () => notification.close(),
                            }),
                        ],
                    }),
                    Widget.Label({
                        class_name: 'description',
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
                class_name: 'actions',
                children: notification.actions.map(action => Widget.Button({
                    onHover: hover,
                    class_name: 'action-button',
                    onClicked: () => notification.invoke(action.id),
                    hexpand: true,
                    child: Widget.Label(action.label),
                })),
            }),
        }),
    });

    return Widget.EventBox({
        class_name: `notification ${notification.urgency}`,
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
