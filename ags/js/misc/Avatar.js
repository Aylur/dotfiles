import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import options from '../options.js';

/** @param {import('types/widgets/box').BoxProps=} props */
export default props => Widget.Box({
    ...props,
    class_name: 'avatar',
    connections: [[options.avatar, box => box.setCss(`
        background-image: url('${options.avatar.value}');
        background-size: cover;
    `)]],
    // child: Widget.Box({
    //     class_name: 'shader',
    //     vexpand: true,
    //     hexpand: true,
    // }),
});
