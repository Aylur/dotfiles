import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Theme from '../services/theme/theme.js';

/** @param { import('types/widgets/box').BoxProps} o */
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
