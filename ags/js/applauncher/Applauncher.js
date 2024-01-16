import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Applications from 'resource:///com/github/Aylur/ags/service/applications.js';
import PopupWindow from '../misc/PopupWindow.js';
import AppItem from './AppItem.js';
import icons from '../icons.js';
import { launchApp } from '../utils.js';
import options from '../options.js';

const WINDOW_NAME = 'applauncher';

const Applauncher = () => {
    const mkItems = () => [
        Widget.Separator({ hexpand: true }),
        ...Applications.query('').flatMap(app => Widget.Revealer({
            setup: w => w.attribute = { app, revealer: w },
            child: Widget.Box({
                vertical: true,
                children: [
                    Widget.Separator({ hexpand: true }),
                    AppItem(app),
                    Widget.Separator({ hexpand: true }),
                ],
            }),
        })),
        Widget.Separator({ hexpand: true }),
    ];

    let items = mkItems();

    const list = Widget.Box({
        class_name: 'app-list',
        vertical: true,
        children: items,
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
        on_change: ({ text }) => items.map(item => {
            if (item.attribute) {
                const { app, revealer } = item.attribute;
                revealer.reveal_child = app.match(text);
            }
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
        setup: self => self.hook(App, (_, win, visible) => {
            if (win !== WINDOW_NAME)
                return;

            entry.text = '-';
            entry.text = '';
            if (visible) {
                entry.grab_focus();
            }
            else {
                items = mkItems();
                list.children = items;
            }
        }),
    });
};

export default () => PopupWindow({
    name: WINDOW_NAME,
    transition: 'slide_down',
    child: Applauncher(),
    anchor: options.applauncher.anchor.bind('value'),
});
