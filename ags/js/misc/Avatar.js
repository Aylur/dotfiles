import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import options from '../options.js';

/** @param {import('types/widgets/box').BoxProps=} props */
export default props => Widget.Box({
    ...props,
    class_name: 'avatar',
    connections: [
        [options.desktop.avatar, box => box.setCss(`
            background-image: url('${options.desktop.avatar.value}');
            background-size: cover;
        `)],
        ['draw', box => {
            const h = box.get_allocated_height();
            box.set_size_request(h, -1);
        }],
    ],
});
