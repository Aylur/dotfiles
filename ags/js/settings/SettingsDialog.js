import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import RegularWindow from '../misc/RegularWindow.js';

export default () => RegularWindow({
    name: 'settings-dialog',
    title: 'Settings',
    connections: [['delete-event', win => {
        win.hide();
        return true;
    }]],
    child: Widget.Box({
        vertical: true,
        children: [
            Widget.Label('WIP'),
            Widget.Label('WIP'),
            Widget.Label('WIP'),
        ],
    }),
});
