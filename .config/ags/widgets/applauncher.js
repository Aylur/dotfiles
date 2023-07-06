const { Widget } = ags;

Widget.widgets['applauncher/popup-content'] = ({ windowName = 'applauncher' }) => Widget({
    type: 'applauncher',
    className: 'applauncher',
    windowName,
    layout: ({ entry, listbox }) => ({
        type: 'box',
        orientation: 'vertical',
        children: [
            {
                type: 'box',
                className: 'search',
                children: [{
                    type: 'overlay',
                    hexpand: true,
                    vexpand: true,
                    children: [
                        {
                            type: 'wallpaper',
                        },
                        {
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
                        },
                    ],
                }],
            },
            {
                type: 'scrollable',
                hscroll: 'never',
                child: listbox,
            },
        ],
    }),
});
