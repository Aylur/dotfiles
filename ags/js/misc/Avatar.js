import Theme from '../services/theme/theme.js';
const { Box } = ags.Widget;

export default ({ shader = true, ...props } = {}) => Box({
    ...props,
    className: 'avatar',
    connections: [[Theme, box => {
        box.setStyle(`
            background-image: url('${Theme.getSetting('avatar')}');
            background-size: cover;
        `);
    }]],
    children: [
        shader && Box({
            className: 'shader',
            vexpand: true,
            hexpand: true,
        }),
    ],
});
