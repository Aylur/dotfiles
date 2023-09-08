const { Box, EventBox, Revealer } = ags.Widget;

export default ({
    indicator,
    child,
    direction = 'left',
    duration = 300,
    connections,
    ...rest
}) => {
    let open = false;
    const vertical = direction === 'down' || direction === 'up';
    const posStart = direction === 'down' || direction === 'right';
    const posEnd = direction === 'up' || direction === 'left';

    const revealer = Revealer({
        transition: `slide_${direction}`,
        connections,
        transitionDuration: duration,
        child,
    });

    const box = EventBox({
        ...rest,
        onHover: () => {
            if (open)
                return;

            revealer.revealChild = true;
            ags.Utils.timeout(duration, () => open = true);
        },
        onHoverLost: () => {
            if (!open)
                return;

            revealer.revealChild = false;
            open = false;
        },
        child: Box({
            vertical,
            children: [
                posStart ? indicator : null,
                revealer,
                posEnd ? indicator : null,
            ],
        }),
    });

    return Box({
        children: [box],
    });
};

