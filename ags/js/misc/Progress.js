import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

export default ({
    height = 18,
    width = 180,
    vertical = false,
    child,
    ...props
}) => {
    const fill = Widget.Box({
        class_name: 'fill',
        hexpand: vertical,
        vexpand: !vertical,
        hpack: vertical ? 'fill' : 'start',
        vpack: vertical ? 'end' : 'fill',
        children: [child],
    });

    let fill_size = 0;

    return Widget.Box({
        ...props,
        class_name: 'progress',
        css: `
            min-width: ${width}px;
            min-height: ${height}px;
        `,
        children: [fill],
        setup: progress => progress.setValue = value => {
            if (value < 0)
                return;

            const axis = vertical ? 'height' : 'width';
            const axisv = vertical ? height : width;
            const min = vertical ? width : height;
            const preferred = (axisv - min) * value + min;

            if (!fill_size) {
                fill_size = preferred;
                fill.setCss(`min-${axis}: ${preferred}px;`);
                return;
            }

            const frames = 10;
            const goal = preferred - fill_size;
            const step = goal / frames;

            for (let i = 0; i < frames; ++i) {
                Utils.timeout(5 * i, () => {
                    fill_size += step;
                    fill.setCss(`min-${axis}: ${fill_size}px`);
                });
            }
        },
    });
};
