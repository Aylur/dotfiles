import Theme from '../services/theme/theme.js';
import { Widget } from '../imports.js';

export default ({ shader = true, ...props } = {}) => Widget.Box({
    ...props,
    className: 'avatar',
    connections: [[Theme, box => {
        box.setStyle(`
            background-image: url('${Theme.getSetting('avatar')}');
            background-size: cover;
        `);
    }]],
    children: [
        shader && Widget.Box({
            className: 'shader',
            vexpand: true,
            hexpand: true,
        }),
    ],
});
