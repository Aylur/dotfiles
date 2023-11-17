import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Applications from 'resource:///com/github/Aylur/ags/service/applications.js';
import PopupWindow from '../misc/PopupWindow.js';
import AppItem from './AppItem.js';
import icons from '../icons.js';
import { launchApp } from '../utils.js';

const WINDOW_NAME = 'applauncher';

const Applauncher = () => {
    const children = () => [
        ...Applications.query('').flatMap(app => {
            const item = AppItem(app);
            return [
                Widget.Separator({
                    hexpand: true,
                    binds: [['visible', item, 'visible']],
                }),
                item,
            ];
        }),
        Widget.Separator({ hexpand: true }),
    ];

    const list = Widget.Box({
        vertical: true,
        children: children(),
    });

    const entry = Widget.Entry({
        hexpand: true,
        primary_icon_name: icons.apps.search,

        // set some text so on-change works the first time
        text: '-',
        on_accept: ({ text }) => {
            const list = Applications.query(text || '');
            if (list[0]) {
                App.toggleWindow(WINDOW_NAME);
                launchApp(list[0]);
            }
        },
        on_change: ({ text }) => list.children.map(item => {
            if (item.app)
                item.visible = item.app.match(text);
        }),
    });

    return Widget.Box({
        vertical: true,
        children: [
            entry,
            Widget.Scrollable({
                hscroll: 'never',
                child: list,
            }),
        ],
        connections: [[App, (_, name, visible) => {
            if (name !== WINDOW_NAME)
                return;

            entry.text = '';
            if (visible)
                entry.grab_focus();
            else
                list.children = children();
        }]],
    });
};

export default () => PopupWindow({
    name: WINDOW_NAME,
    transition: 'slide_down',
    child: Applauncher(),
});
