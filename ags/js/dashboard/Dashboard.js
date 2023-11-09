import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import DateColumn from './DateColumn.js';
import NotificationColumn from './NotificationColumn.js';
import PopupWindow from '../misc/PopupWindow.js';

/**
 * @param {Object} o
 * @param {import('types/widgets/window').WindowProps['anchor']=} o.anchor
 * @param {import('../misc/PopupWindow.js').PopopWindowProps['layout']=} o.layout
 */
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
