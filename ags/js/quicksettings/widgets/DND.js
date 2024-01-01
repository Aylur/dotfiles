import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import icons from '../../icons.js';
import { SimpleToggleButton } from '../ToggleButton.js';

export default () => SimpleToggleButton({
    icon: Widget.Icon({
        icon: Notifications.bind('dnd').transform(dnd => icons.notifications[dnd ? 'silent' : 'noisy']),
    }),
    toggle: () => Notifications.dnd = !Notifications.dnd,
    connection: [Notifications, () => Notifications.dnd],
});
