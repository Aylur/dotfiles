const { Widget } = ags;
const { timeout, getConfig, exec } = ags.Utils;
const { Theme } = ags.Service;

Widget.widgets['separator'] = props => Widget({
    ...props,
    type: 'box',
    className: 'separator',
});

Widget.widgets['font-icon'] = ({
    icon,
    size = getConfig().baseIconSize || 16,
    scale = 1,
    angle,
}) => Widget({
    type: 'box',
    children: [{
        type: 'overlay',
        children: [
            {
                type: 'box',
                style: `
                    min-width: ${size}px;
                    min-height: ${size}px;
                `,
            },
            {
                type: 'label',
                label: icon,
                angle,
                style: `font-size: ${size * scale}px`,
                halign: 'center', valign: 'center',
            },
        ],
    }],
});

Widget.widgets['distro-icon'] = props => Widget({
    ...props,
    type: 'font-icon',
    className: 'distro-icon',
    icon: (() => {
        // eslint-disable-next-line quotes
        const distro = exec(`bash -c "cat /etc/os-release | grep '^ID' | head -n 1 | cut -d '=' -f2"`)
            .toLowerCase();

        switch (distro) {
        case 'fedora': return '';
        case 'arch': return '';
        case 'nixos': return '';
        case 'debian': return '';
        case 'opensuse-tumbleweed': return '';
        case 'ubuntu': return '';
        case 'endeavouros': return '';
        default: return '';
        }
    })(),
});

Widget.widgets['avatar'] = ({ child, ...props }) => Widget({
    ...props,
    type: 'box',
    className: 'image',
    connections: [[Theme, box => {
        box.setStyle(`
            background-image: url('${Theme.getSetting('avatar')}');
            background-size: cover;
            `);
    }]],
    children: [{
        type: 'box',
        className: 'shader',
        hexpand: true,
        children: [child],
    }],
});

Widget.widgets['spinner'] = ({ icon = 'process-working-symbolic' }) => Widget({
    type: 'icon',
    icon,
    properties: [['deg', 0]],
    connections: [[10, w => {
        w.setStyle(`-gtk-icon-transform: rotate(${w._deg++ % 360}deg);`);
    }]],
});

Widget.widgets['progress'] = ({ height = 18, width = 180, vertical = false, child, ...props }) => {
    const fill = Widget({
        type: 'box',
        className: 'fill',
        hexpand: vertical,
        vexpand: !vertical,
        halign: vertical ? 'fill' : 'start',
        valign: vertical ? 'end' : 'fill',
        children: [child],
    });
    const progress = Widget({
        ...props,
        type: 'box',
        className: 'progress',
        style: `
            min-width: ${width}px;
            min-height: ${height}px;
        `,
        children: [fill],
    });
    progress.setValue = value => {
        if (value < 0)
            return;

        const axis = vertical ? 'height' : 'width';
        const axisv = vertical ? height : width;
        const min = vertical ? width : height;
        const preferred = (axisv - min) * value + min;

        if (!fill._size) {
            fill._size = preferred;
            fill.setStyle(`min-${axis}: ${preferred}px;`);
            return;
        }

        const frames = 10;
        const goal = preferred - fill._size;
        const step = goal / frames;

        for (let i = 0; i < frames; ++i) {
            timeout(5 * i, () => {
                fill._size += step;
                fill.setStyle(`min-${axis}: ${fill._size}px`);
            });
        }
    };
    return progress;
};

Widget.widgets['hover-revealer'] = ({ indicator, child, direction = 'left', connection, duration = 300, ...rest }) => Widget({
    type: 'box',
    children: [{
        ...rest,
        type: 'eventbox',
        onHover: w => {
            if (w._open)
                return;

            w.get_child().get_children()[direction === 'down' || direction === 'right' ? 1 : 0].reveal_child = true;
            timeout(duration, () => w._open = true);
        },
        onHoverLost: w => {
            if (!w._open)
                return;

            w.get_child().get_children()[direction === 'down' || direction === 'right' ? 1 : 0].reveal_child = false;
            w._open = false;
        },
        child: {
            type: 'box',
            orientation: direction === 'down' || direction === 'up' ? 'vertical' : 'horizontal',
            children: [
                direction === 'down' || direction === 'right' ? indicator : null,
                {
                    type: 'revealer',
                    transition: `slide_${direction}`,
                    connections: connection ? [connection] : undefined,
                    duration,
                    child,
                },
                direction === 'up' || direction === 'left' ? indicator : null,
            ].filter(i => i),
        },
    }],
});
