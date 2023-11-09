import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Theme from '../services/theme/theme.js';

/** @param {import('types/widgets/box').BoxProps=} props */
export default props => Widget.Box({
    ...props,
    class_name: 'avatar',
    connections: [[Theme, box => box.setCss(`
        background-image: url('${Theme.getSetting('avatar')}');
        background-size: cover;
    `)]],
    // child: Widget.Box({
    //     class_name: 'shader',
    //     vexpand: true,
    //     hexpand: true,
    // }),
});
