import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Applications from 'resource:///com/github/Aylur/ags/service/applications.js';
import AppItem from './AppItem.js';
import options from '../options.js';
import PopopWindow from '../misc/PopupWindow.js';
import icons from '../icons.js';

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
        binds: [['spacing', options.spacing]],
        vertical: true,
        children: children(),
    });

    const entry = Widget.Entry({
        hexpand: true,
        binds: [['css', options.spacing, 'value', m => `margin-bottom: ${m}px;`]],

        // set some text so on-change works the first time
        text: '-',
        on_accept: ({ text }) => {
            const list = Applications.query(text || '');
            if (list[0]) {
                App.toggleWindow(WINDOW_NAME);
                list[0].launch();
            }
        },
        on_change: ({ text }) => list.children.map(item => {
            if (item.app)
                item.visible = item.app.match(text);
        }),
    });

    return Widget.Box({
        vertical: true,
        binds: [['css', options.spacing, 'value', m => `margin: ${m * 2}px;`]],
        children: [
            Widget.Box({
                children: [
                    Widget.Icon(icons.apps.search),
                    entry,
                ],
            }),
            Widget.Scrollable({
                binds: [
                    ['css', options.applauncher.height, 'value', h => `
                        min-width: ${options.applauncher.width.value}px;
                        min-height: ${h}px;

                    `],
                    ['css', options.applauncher.width, 'value', w => `
                        min-width: ${w}px;
                        min-height: ${options.applauncher.height.value}px;

                    `],
                ],
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

export default () => PopopWindow({
    name: WINDOW_NAME,
    content: Applauncher(),
});
