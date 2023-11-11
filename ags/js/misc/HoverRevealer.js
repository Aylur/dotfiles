import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

/**
 * @typedef {import('types/widgets/eventbox').EventBoxProps & {
 *    indicator?: import('types/widgets/box').BoxProps['child']
 *    direction?: 'left' | 'right' | 'down' | 'up'
 *    duration?: number
 *    eventboxConnections?: import('types/widgets/box').BoxProps['connections']
 *    connections?: import('types/widgets/revealer').RevealerProps['connections']
 * }} HoverRevealProps
 */

/**
 * @param {HoverRevealProps} props
 */
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

    const eventbox = Widget.EventBox({
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
        children: [eventbox],
    });
};

