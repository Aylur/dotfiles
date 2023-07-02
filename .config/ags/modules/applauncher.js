const { App, Widget } = ags;
const { Applications } = ags.Service;

const _item = ({ name, description, iconName, launch }, window) => {
    const title = Widget({
        className: 'title',
        type: 'label',
        label: name,
        xalign: 0,
        valign: 'center',
    });
    const desc = Widget({
        className: 'description',
        type: 'label',
        label: description,
        wrap: true,
        xalign: 0,
        justify: 'left',
        valign: 'center',
    });
    const icon = Widget({
        type: 'icon',
        icon: iconName,
        size: 38,
    });
    const btn = Widget({
        className: 'app',
        type: 'button',
        child: Widget({
            type: 'box',
            children: [
                icon,
                Widget({
                    type: 'box',
                    orientation: 'vertical',
                    children: [title, desc],
                }),
            ],
        }),
        onClick: () => {
            App.toggleWindow(window);
            launch();
        },
    });
    return btn;
};

const _listbox = () => {
    const box = Widget({
        type: 'box',
        orientation: 'vertical',
    });
    box.push = item => {
        box.add(item);
        box.show_all();
    };
    box.clear = () => {
        box.get_children().forEach(ch => ch.destroy());
        box.show_all();
    };
    return box;
};

const _layout = ({ entry, listbox }) => ({
    type: 'box',
    orientation: 'vertical',
    children: [
        entry,
        Widget({
            type: 'scrollable',
            hscroll: 'never',
            child: listbox,
        }),
    ],
});

Widget.widgets['applauncher'] = ({
    placeholder = 'Search',
    windowName = 'applauncher',
    listbox = _listbox,
    item = _item,
    layout = _layout,
}) => {
    const appsbox = Widget(listbox);

    const entry = Widget({
        type: 'entry',
        hexpand: true,
        placeholder,
        text: 'Orbán egy faszszopó',
        onAccept: search => {
            const list = Applications.query(search);
            if (list[0]) {
                App.toggleWindow(windowName);
                list[0].launch();
            }
        },
        onChange: search => {
            appsbox.clear();
            Applications.query(search).forEach(app => {
                appsbox.push(Widget(item(app, windowName)));
            });
        },
    });

    const box = Widget({
        type: () => Widget(layout({
            entry,
            listbox: appsbox,
        })),
        connections: [[App, App.connect('window-toggled', (_app, name, visible) => {
            if (name !== windowName)
                return;

            entry.set_text('');
            if (visible)
                box.grab_focus();
        })]],
    });

    return box;
};
