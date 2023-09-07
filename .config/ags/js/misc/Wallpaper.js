import Theme from '../services/theme/theme.js';
import GLib from 'gi://GLib';
const { Box } = ags.Widget;

export default ({ className, ...props }) => Box({
    ...props,
    className: `wallpaper ${className}`,
    connections: [[Theme, box => {
        box.setStyle(`
            background-image: url('${Theme.getSetting('wallpaper')}');
            background-size: cover;
        `);
    }]],
});
