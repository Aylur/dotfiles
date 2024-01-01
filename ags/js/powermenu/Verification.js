import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import PowerMenu from '../services/powermenu.js';
import ShadedPopup from './ShadedPopup.js';

export default () => ShadedPopup({
    name: 'verification',
    expand: true,
    child: Widget.Box({
        vertical: true,
        children: [
            Widget.Box({
                class_name: 'text-box',
                vertical: true,
                children: [
                    Widget.Label({
                        class_name: 'title',
                        label: PowerMenu.bind('title'),
                    }),
                    Widget.Label({
                        class_name: 'desc',
                        label: 'Are you sure?',
                    }),
                ],
            }),
            Widget.Box({
                class_name: 'buttons horizontal',
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
