const { Box, Label, Overlay } = ags.Widget;

export default ({ icon = '', className, ...props }) => {
    const box = Box({
        style: 'min-width: 1px; min-height: 1px;',
    });
    const label = Label({
        className: `font-icon ${className}`,
        label: icon,
        halign: 'center',
        valign: 'center',
    });
    return Box({
        ...props,
        setup: box => box.label = label,
        children: [Overlay({
            child: box,
            overlays: [label],
            connections: [['draw', overlay => {
                const size = overlay.get_style_context()
                    .get_property('font-size', imports.gi.Gtk.StateFlags.NORMAL) || 11;

                box.setStyle(`min-width: ${size}px; min-height: ${size}px;`);
                overlay.passThrough = true;
            }]],
        })],
    });
};
