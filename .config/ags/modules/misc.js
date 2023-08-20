const { Box, Label, Overlay, Icon, Revealer, EventBox } = ags.Widget;
const { timeout, exec } = ags.Utils;

export const Separator = ({ className = '', ...props } = {}) => Box({
    hexpand: false,
    vexpand: false,
    ...props,
    className: [...className.split(' '), 'separator'].join(' '),
});

export const FontIcon = ({ icon = '', ...props }) => {
    const box = Box({
        style: 'min-width: 1px; min-height: 1px;',
    });
    const label = Label({
        label: icon,
        halign: 'center',
        valign: 'center',
    });
    return Box({
        ...props,
        setup: box => box.label = label,
        className: 'icon',
        children: [Overlay({
            child: box,
            overlays: [label],
            passThrough: true,
            connections: [['draw', overlay => {
                const size = overlay.get_style_context()
                    .get_property('font-size', imports.gi.Gtk.StateFlags.NORMAL) || 11;

                box.setStyle(`min-width: ${size}px; min-height: ${size}px;`);
            }]],
        })],
    });
};

export const DistroIcon = props => FontIcon({
    ...props,
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

export const Spinner = ({ icon = 'process-working-symbolic' }) => Icon({
    icon,
    properties: [['deg', 0]],
    connections: [[10, w => {
        w.setStyle(`-gtk-icon-transform: rotate(${w._deg++ % 360}deg);`);
    }]],
});

export const Progress = ({ height = 18, width = 180, vertical = false, child, ...props }) => {
    const fill = Box({
        className: 'fill',
        hexpand: vertical,
        vexpand: !vertical,
        halign: vertical ? 'fill' : 'start',
        valign: vertical ? 'end' : 'fill',
        children: [child],
    });
    const progress = Box({
        ...props,
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

export const HoverRevealer = ({
    indicator,
    child,
    direction = 'left',
    duration = 300,
    connections,
    ...rest
}) => Box({
    children: [EventBox({
        ...rest,
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
        child: Box({
            vertical: direction === 'down' || direction === 'up',
            children: [
                direction === 'down' || direction === 'right' ? indicator : null,
                Revealer({
                    transition: `slide_${direction}`,
                    connections,
                    transitionDuration: duration,
                    child,
                }),
                direction === 'up' || direction === 'left' ? indicator : null,
            ],
        }),
    })],
});
