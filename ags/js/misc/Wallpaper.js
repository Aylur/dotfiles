import Theme from '../services/theme/theme.js';
import { Widget } from '../imports.js';

export default ({ className, ...props }) => Widget.Box({
    ...props,
    className: `wallpaper ${className}`,
    connections: [[Theme, box => {
        box.setStyle(`
            background-image: url('${Theme.getSetting('wallpaper')}');
            background-size: cover;
        `);
    }]],
});
