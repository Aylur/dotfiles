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
    setupEventBox: box => box
        .on('button-press-event', () => App.openWindow('dashboard'))
        .hook(Notifications, () => box.visible =
            Notifications.notifications.length > 0 || Notifications.dnd),

    setupRevealer: self => self.hook(Notifications, () => {
        let title = '';
        const summary = Notifications.notifications[0]?.summary;
        if (title === summary)
            return;

        title = summary;
        self.reveal_child = true;
        Utils.timeout(3000, () => {
            self.reveal_child = false;
        });
    }),
    direction,
    indicator: Widget.Icon({
        icon: Notifications.bind('dnd').transform(dnd => icons.notifications[dnd ? 'silent' : 'noisy']),
    }),
    child: Widget.Label({
        truncate: 'end',
        max_width_chars: 40,
        label: Notifications.bind('notifications').transform(n => n.reverse()[0]?.summary || ''),
    }),
});
