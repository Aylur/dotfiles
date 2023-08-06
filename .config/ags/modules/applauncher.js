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
        label: description || '',
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
        box.add(Widget(item));
        box.add(Widget({ type: 'separator', hexpand: true }));
        box.show_all();
    };
    box.clear = () => {
        box.get_children().forEach(ch => ch.destroy());
        box.add(Widget({ type: 'separator', hexpand: true }));
        box.show_all();
    };
    return box;
};

const _layout = ({ entry, listbox }) => ({
    type: 'box',
    orientation: 'vertical',
    children: [
        {
            type: 'wallpaper',
            className: 'search',
            children: [{
                type: 'box',
                valign: 'center',
                className: 'entry',
                children: [
                    {
                        type: 'icon',
                        icon: 'folder-saved-search-symbolic',
                        size: 20,
                    },
                    entry,
                ],

            }],
        },
        {
            type: 'scrollable',
            hscroll: 'never',
            child: listbox,
        },
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
        text: '-',
        onAccept: ({ text }) => {
            const list = Applications.query(text);
            if (list[0]) {
                App.toggleWindow(windowName);
                list[0].launch();
            }
        },
        onChange: ({ text }) => {
            appsbox.clear();
            Applications.query(text).forEach(app => {
                appsbox.push(Widget(item(app, windowName)));
            });
        },
    });

    return Widget({
        type: () => Widget(layout({
            entry,
            listbox: appsbox,
        })),
        connections: [[App, (_b, name, visible) => {
            if (name !== windowName)
                return;

            entry.set_text('');
            if (visible)
                entry.grab_focus();
        }]],
    });
};
