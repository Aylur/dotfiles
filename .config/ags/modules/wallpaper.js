const { Widget } = ags;
const { Theme } = ags.Service;

Widget.widgets['wallpaper'] = props => Widget({
    ...props,
    type: 'box',
    className: 'wallpaper',
    connections: [[Theme, box => {
        box.setStyle(`
            background-image: url('${Theme.getSetting('wallpaper')}');
            background-size: cover;
        `);
    }]],
});
