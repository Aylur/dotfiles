import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import icons from '../../icons.js';
import HoverRevealer from '../../misc/HoverRevealer.js';

/**
 * @param {Object} o
 * @param {import('../../misc/HoverRevealer').HoverRevealProps['direction']=} o.direction
 */
export default ({ direction = 'left' } = {}) => HoverRevealer({
    class_name: 'notifications panel-button',
    eventboxConnections: [
        ['button-press-event', () => App.openWindow('dashboard')],
        [Notifications, box => box.visible =
            Notifications.notifications.length > 0 || Notifications.dnd],
    ],
    connections: [[Notifications, revealer => {
        const title = Notifications.notifications[0]?.summary;
        if (revealer._title === title)
            return;

        revealer._title = title;
        revealer.reveal_child = true;
        Utils.timeout(3000, () => {
            revealer.reveal_child = false;
        });
    }]],
    direction,
    indicator: Widget.Icon({
        binds: [['icon', Notifications, 'dnd', dnd => dnd
            ? icons.notifications.silent
            : icons.notifications.noisy,
        ]],
    }),
    child: Widget.Label({
        truncate: 'end',
        max_width_chars: 40,
        binds: [['label', Notifications, 'notifications', n => n.reverse()[0]?.summary || '']],
    }),
});
