import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

/**
 * @typedef {import('types/widgets/eventbox').EventBoxProps & {
 *    indicator?: import('types/widgets/box').BoxProps['child']
 *    direction?: 'left' | 'right' | 'down' | 'up'
 *    duration?: number
 *    setupRevealer?: (rev: ReturnType<typeof Widget.Revealer>) => void
 *    setupEventBox?: (rev: ReturnType<typeof Widget.EventBox>) => void
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
    setupEventBox,
    setupRevealer,
    ...rest
}) => {
    let open = false;
    const vertical = direction === 'down' || direction === 'up';
    const posStart = direction === 'down' || direction === 'right';
    const posEnd = direction === 'up' || direction === 'left';

    const revealer = Widget.Revealer({
        transition: `slide_${direction}`,
        setup: setupRevealer,
        transition_duration: duration,
        child,
    });

    const eventbox = Widget.EventBox({
        ...rest,
        setup: setupEventBox,
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

