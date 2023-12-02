import options from '../options.js';
import { exec, execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import { dependencies } from '../utils.js';

export function initWallpaper() {
    if (dependencies(['swww'])) {
        exec('swww init');

        options.desktop.wallpaper.img.connect('changed', wallpaper);
    }
}

export function wallpaper() {
    if (!dependencies(['swww']))
        return;

    execAsync([
        'swww', 'img',
        '--transition-type', 'grow',
        '--transition-pos', exec('hyprctl cursorpos').replace(' ', ''),
        options.desktop.wallpaper.img.value,
    ]).catch(err => console.error(err));
}
