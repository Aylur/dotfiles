import { Widget, App, Applications } from '../imports.js';
import PopupWindow from '../misc/PopupWindow.js';
import icons from '../icons.js';
import { launchApp } from '../utils.js';

const WINDOW_NAME = 'applauncher';

const AppItem = app => Widget.Button({
    class_name: 'app',
    on_clicked: () => {
        App.closeWindow(WINDOW_NAME);
        launchApp(app);
    },
    child: Widget.Box({
        children: [
            Widget.Icon({
                icon: app.iconName,
                size: 48,
            }),
            Widget.Box({
                vertical: true,
                children: [
                    Widget.Label({
                        class_name: 'title',
                        label: app.name,
                        xalign: 0,
                        vpack: 'center',
                        ellipsize: 3,
                    }),
                    Widget.Label({
                        class_name: 'description',
                        label: app.description || '',
                        wrap: true,
                        xalign: 0,
                        justification: 'left',
                        vpack: 'center',
                    }),
                ],
            }),
        ],
    }),
});

const Applauncher = () => {
    const list = Widget.Box({ vertical: true });

    const placeholder = Widget.Label({
        label: " Couldn't find a match",
        class_name: 'placeholder',
    });

    const entry = Widget.Entry({
        hexpand: true,
        text: '-',
        placeholder_text: 'Search',
        on_accept: ({ text }) => {
            const list = Applications.query(text || '');
            if (list[0]) {
                App.toggleWindow(WINDOW_NAME);
                launchApp(list[0]);
            }
        },
        on_change: ({ text }) => {
            list.children = Applications.query(text || '').map(app => [
                Widget.Separator(),
                AppItem(app),
            ]).flat();
            list.add(Widget.Separator());
            list.show_all();

            placeholder.visible = list.children.length === 1;
        },
    });

    return Widget.Box({
        class_name: 'applauncher',
        properties: [['list', list]],
        vertical: true,
        children: [
            Widget.Box({
                class_name: 'header',
                children: [
                    Widget.Icon(icons.apps.search),
                    entry,
                ],
            }),
            Widget.Scrollable({
                hscroll: 'never',
                child: Widget.Box({
                    vertical: true,
                    children: [list, placeholder],
                }),
            }),
        ],
        connections: [[App, (_, name, visible) => {
            if (name !== WINDOW_NAME)
                return;

            entry.set_text('');
            if (visible)
                entry.grab_focus();
        }]],
    });
};

export default () => PopupWindow({
    name: WINDOW_NAME,
    content: Applauncher(),
});
