import Theme from '../services/theme/theme.js';
import { Widget } from '../imports.js';

export default props => Widget.Box({
    ...props,
    className: 'avatar',
    connections: [[Theme, box => {
        box.setStyle(`
            background-image: url('${Theme.getSetting('avatar')}');
            background-size: cover;
        `);
    }]],
    // child: Widget.Box({
    //     className: 'shader',
    //     vexpand: true,
    //     hexpand: true,
    // }),
});
