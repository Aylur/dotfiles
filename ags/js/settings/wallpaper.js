import options from '../options.js';
import { exec, execAsync } from 'resource:///com/github/Aylur/ags/utils.js';

export function initWallpaper() {
    try {
        exec('swww init');
    } catch (error) {
        print('missing dependancy: swww');
    }
}

export function wallpaper() {
    if (!exec('which swww'))
        return print('missing dependancy: swww');

    execAsync([
        'swww', 'img',
        '--transition-type', 'grow',
        '--transition-pos', exec('hyprctl cursorpos').replace(' ', ''),
        options.desktop.wallpaper.value,
    ]).catch(err => console.error(err));
}
