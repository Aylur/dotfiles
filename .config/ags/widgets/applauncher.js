const { App, Widget } = ags;
const { Hyprland } = ags.Service;

Widget.widgets['apps/popup-content'] = ({ window, wallpapers = [] }) => Widget({
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
                connections: [[Hyprland, box => {
                    if (!App.getWindow(window)?.visible)
                        return;


                    box.setStyle(`
                        background-image: url("${wallpapers[Hyprland.state.active.workspace.id]}");
                        background-size: cover;
                        `);
                }]],
                children: [
                    {
                        type: 'box',
                        className: 'icon',
                        children: [{
                            type: 'icon',
                            icon: 'view-grid-symbolic',
                            size: 20,
                        }],
                    },
                    entry,
                ],
            },
            Widget({
                type: 'scrollable',
                hscroll: 'never',
                child: listbox,
            }),
        ],
    }),
});
