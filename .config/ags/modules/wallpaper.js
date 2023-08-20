import { Theme } from '../theme/theme.js';
const { Box } = ags.Widget;

export const Wallpaper = props => Box({
    className: 'wallpaper',
    ...props,
    connections: [[Theme, box => {
        box.setStyle(`
            background-image: url('${Theme.getSetting('wallpaper')}');
            background-size: cover;
        `);
    }]],
});
