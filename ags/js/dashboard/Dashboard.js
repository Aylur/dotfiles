import DateColumn from './DateColumn.js';
import NotificationColumn from './NotificationColumn.js';
import PopupWindow from '../misc/PopupWindow.js';
import { Widget } from '../imports.js';

export default ({ anchor = ['top'], layout = 'top' } = {}) => PopupWindow({
    name: 'dashboard',
    layout,
    anchor,
    content: Widget.Box({
        class_name: 'dashboard',
        children: [
            NotificationColumn(),
            Widget.Separator({ orientation: 1 }),
            DateColumn(),
        ],
    }),
});
