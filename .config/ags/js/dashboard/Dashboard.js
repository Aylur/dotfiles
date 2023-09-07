import DateColumn from './DateColumn.js';
import NotificationColumn from './NotificationColumn.js';
import PopupWindow from '../misc/PopupWindow.js';
import Separator from '../misc/Separator.js';

export default ({ anchor = 'top', layout = 'top' } = {}) => PopupWindow({
    name: 'dashboard',
    layout,
    anchor,
    content: ags.Widget.Box({
        className: 'dashboard',
        children: [
            NotificationColumn(),
            Separator({ orientation: 'vertical' }),
            DateColumn(),
        ],
    }),
});
