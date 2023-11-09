import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import PopupWindow from '../misc/PopupWindow.js';
import PowerMenu from '../services/powermenu.js';

export default () => PopupWindow({
    name: 'verification',
    expand: true,
    content: Widget.Box({
        class_name: 'verification',
        vertical: true,
        children: [
            Widget.Label({
                class_name: 'title',
                binds: [['label', PowerMenu, 'title']],
            }),
            Widget.Label({
                class_name: 'desc',
                label: 'Are you sure?',
            }),
            Widget.Box({
                class_name: 'buttons',
                vexpand: true,
                vpack: 'end',
                homogeneous: true,
                children: [
                    Widget.Button({
                        child: Widget.Label('No'),
                        on_clicked: () => App.toggleWindow('verification'),
                    }),
                    Widget.Button({
                        child: Widget.Label('Yes'),
                        on_clicked: () => Utils.exec(PowerMenu.cmd),
                    }),
                ],
            }),
        ],
    }),
});
