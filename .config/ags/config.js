const { CONFIG_DIR, exec } = ags.Utils;

exec(`sassc ${CONFIG_DIR}/scss/dark.scss ${CONFIG_DIR}/dark.css`);
exec(`sassc ${CONFIG_DIR}/scss/light.scss ${CONFIG_DIR}/light.css`);

Object.keys(imports.widgets).forEach(m => imports.widgets[m]);

const wallpapers = [
    '', // workspaces start from 1
    '/home/demeter/Pictures/Wallpapers/kitty/kittyr2.jpeg',
    '/home/demeter/Pictures/Wallpapers/kitty/kittyy2.jpeg',
    '/home/demeter/Pictures/Wallpapers/kitty/kittyc2.jpeg',
    '/home/demeter/Pictures/Wallpapers/kitty/kittybl.jpeg',
    '/home/demeter/Pictures/Wallpapers/kitty/kittyb2.jpeg',
    '/home/demeter/Pictures/Wallpapers/kitty/kittyw.jpeg',
    '/home/demeter/Pictures/Wallpapers/kitty/kittym2.jpeg',
];

var config = {
    baseIconSize: 18,
    closeWindowDelay: {
        'datemenu': 500,
        'quicksettings': 500,
        'media': 500,
    },
    windows: imports.layouts.one.one.windows(wallpapers),
};
