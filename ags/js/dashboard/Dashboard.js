import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import DateColumn from './DateColumn.js';
import NotificationColumn from './NotificationColumn.js';
import PopupWindow from '../misc/PopupWindow.js';
import options from '../options.js';

export default () => PopupWindow({
    name: 'dashboard',
    setup: self => self.hook(options.bar.position, () => {
        self.anchor = [options.bar.position.value];
        if (options.bar.position.value === 'top')
            self.transition = 'slide_down';

        if (options.bar.position.value === 'bottom')
            self.transition = 'slide_up';
    }),
    child: Widget.Box({
        children: [
            NotificationColumn(),
            Widget.Separator({ orientation: 1 }),
            DateColumn(),
        ],
    }),
});
