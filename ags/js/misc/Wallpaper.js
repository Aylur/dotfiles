import Theme from '../services/theme/theme.js';
import { Widget } from '../imports.js';

export default ({ class_name, ...props }) => Widget.Box({
    ...props,
    class_name: `wallpaper ${class_name}`,
    connections: [[Theme, box => {
        box.setCss(`
            background-image: url('${Theme.getSetting('wallpaper')}');
            background-size: cover;
        `);
    }]],
});
