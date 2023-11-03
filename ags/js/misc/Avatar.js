import Theme from '../services/theme/theme.js';
import { Widget } from '../imports.js';

export default props => Widget.Box({
    ...props,
    class_name: 'avatar',
    connections: [[Theme, box => {
        box.setCss(`
            background-image: url('${Theme.getSetting('avatar')}');
            background-size: cover;
        `);
    }]],
    // child: Widget.Box({
    //     class_name: 'shader',
    //     vexpand: true,
    //     hexpand: true,
    // }),
});
