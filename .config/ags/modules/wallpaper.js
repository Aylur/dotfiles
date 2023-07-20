const { Widget } = ags;
const { Settings } = ags.Service;

Widget.widgets['wallpaper'] = props => Widget({
    ...props,
    type: 'box',
    className: 'wallpaper',
    connections: [[Settings, box => {
        box.setStyle(`
            background-image: url('${Settings.wallpaper}');
            background-size: cover;
        `);
    }]],
});
