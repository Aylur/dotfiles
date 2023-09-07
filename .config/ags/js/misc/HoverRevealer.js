const { Box, EventBox, Revealer } = ags.Widget;

export default ({
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

            w.child.children[direction === 'down' || direction === 'right' ? 1 : 0].revealChild = true;
            ags.Utils.timeout(duration, () => w._open = true);
        },
        onHoverLost: w => {
            if (!w._open)
                return;

            w.child.children[direction === 'down' || direction === 'right' ? 1 : 0].revealChild = false;
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
