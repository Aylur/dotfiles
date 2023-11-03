import { Widget, Utils } from '../imports.js';

export default ({
    indicator,
    child,
    direction = 'left',
    duration = 300,
    connections = [],
    eventboxConnections = [],
    binds = [],
    ...rest
}) => {
    let open = false;
    const vertical = direction === 'down' || direction === 'up';
    const posStart = direction === 'down' || direction === 'right';
    const posEnd = direction === 'up' || direction === 'left';

    const revealer = Widget.Revealer({
        transition: `slide_${direction}`,
        connections,
        binds,
        transition_duration: duration,
        child,
    });

    const box = Widget.EventBox({
        ...rest,
        connections: eventboxConnections,
        on_hover: () => {
            if (open)
                return;

            revealer.reveal_child = true;
            Utils.timeout(duration, () => open = true);
        },
        on_hover_lost: () => {
            if (!open)
                return;

            revealer.reveal_child = false;
            open = false;
        },
        child: Widget.Box({
            vertical,
            children: [
                posStart && indicator,
                revealer,
                posEnd && indicator,
            ],
        }),
    });

    return Widget.Box({
        children: [box],
    });
};

