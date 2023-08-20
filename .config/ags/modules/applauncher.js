const { App } = ags;
const { Applications } = ags.Service;
const { Label, Box, Icon, Button, Scrollable, Entry } = ags.Widget;
import { Wallpaper } from './wallpaper.js';
import { Separator } from './misc.js';

const AppItem = (app, window) => Button({
    className: 'app',
    connections: [['clicked', () => {
        App.closeWindow(window);
        app.launch();
    }]],
    child: Box({
        children: [
            Icon({
                icon: app.iconName,
                size: 42,
            }),
            Box({
                vertical: true,
                children: [
                    Label({
                        className: 'title',
                        label: app.name,
                        xalign: 0,
                        valign: 'center',
                        ellipsize: 3,
                    }),
                    Label({
                        className: 'description',
                        label: app.description || '',
                        wrap: true,
                        xalign: 0,
                        justification: 'left',
                        valign: 'center',
                    }),
                ],
            }),
        ],
    }),
});

export const Applauncher = ({ windowName = 'applauncher' } = {}) => {
    const list = Box({ vertical: true });
    const entry = Entry({
        hexpand: true,
        placeholderText: 'Search',
        onAccept: ({ text }) => {
            const list = Applications.query(text);
            if (list[0]) {
                App.toggleWindow(windowName);
                list[0].launch();
            }
        },
        onChange: ({ text }) => {
            list.children = Applications.query(text).map(app => [
                Separator(),
                AppItem(app, windowName),
            ]).flat();
            list.add(Separator());
            list.show_all();
        },
    });

    return Box({
        className: 'applauncher',
        properties: [['list', list]],
        vertical: true,
        children: [
            Wallpaper({
                children: [
                    Icon('folder-saved-search-symbolic'),
                    entry,
                ],

            }),
            Scrollable({
                hscroll: 'never',
                child: list,
            }),
        ],
        connections: [[App, (_b, name, visible) => {
            if (name !== windowName)
                return;

            entry.set_text('-'); // force onChange
            entry.set_text('');
            if (visible)
                entry.grab_focus();
        }]],
    });
};
