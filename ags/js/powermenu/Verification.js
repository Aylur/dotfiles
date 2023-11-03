import PopupWindow from '../misc/PopupWindow.js';
import PowerMenu from '../services/powermenu.js';
import { Widget, App, Utils } from '../imports.js';

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
                        onClicked: () => App.toggleWindow('verification'),
                    }),
                    Widget.Button({
                        child: Widget.Label('Yes'),
                        onClicked: () => Utils.exec(PowerMenu.cmd),
                    }),
                ],
            }),
        ],
    }),
});
