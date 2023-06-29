const { App, Widget } = ags;
const { Hyprland } = ags.Service;

Widget.widgets['apps/popup-content'] = ({ window = [] }) => Widget({
    type: 'app-launcher',
    className: 'applauncher',
    window,
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
                                    icon: 'view-grid-symbolic',
                                    size: 20,
                                },
                                entry,
                            ],
                        },
                    ],
                }],
            },
            Widget({
                type: 'scrollable',
                hscroll: 'never',
                child: listbox,
            }),
        ],
    }),
});
