import Separator from '../misc/Separator.js';
import PopupWindow from '../misc/PopupWindow.js';
import icons from '../icons.js';
const { App } = ags;
const { Applications } = ags.Service;
const { Label, Box, Icon, Button, Scrollable, Entry } = ags.Widget;

const AppItem = (app, window) => Button({
    className: 'app',
    connections: [['clicked', () => {
        App.closeWindow(window);
        app.launch();
    }]],
    child: Box({
        children: [
            Icon({
                icon: app.app.get_string('Icon'),
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

const Applauncher = ({ windowName = 'applauncher' } = {}) => {
    const list = Box({ vertical: true });
    const placeholder = Label({
        label: " Couldn't find a match",
        className: 'placeholder',
    });
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

            placeholder.visible = list.children.length === 1;
        },
    });

    return Box({
        className: 'applauncher',
        properties: [['list', list]],
        vertical: true,
        children: [
            Box({
                className: 'header',
                children: [
                    Icon(icons.apps.search),
                    entry,
                ],
            }),
            Scrollable({
                hscroll: 'never',
                child: Box({
                    vertical: true,
                    children: [list, placeholder],
                }),
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

export default () => PopupWindow({
    name: 'applauncher',
    content: Applauncher(),
});
