const { Widget } = ags;
const { Hyprland } = ags.Service;

const wallpaper = (wallpapers) => Widget({
    type: 'dynamic',
    items: wallpapers.map((w, i) => ({
        value: i,
        widget: {
            type: 'box',
            hexpand: true,
            vexpand: true,
            style: `
                background-image: url("${w}");
                background-size: cover;
            `,
        }
    })),
    connections: [[Hyprland, d => {
        const ws = Hyprland.state.active.workspace.id;
        if (d._ws !== ws) {
            d._ws = ws;
            d.update(v => v === ws);
        }
    }]],
});

Widget.widgets['desktop'] = ({ wallpapers }) => Widget({
    type: 'overlay',
    className: 'desktop',
    children: [
        wallpaper(wallpapers),
        {
            type: 'box',
            orientation: 'vertical',
            valign: 'center',
            halign: 'center',
            children: [
                { type: 'clock', className: 'clock', format: '%H:%M' },
                { type: 'clock', className: 'date', format: '%B %e. %A' },
            ]
        },
        { type: 'corners' },
    ],
})
