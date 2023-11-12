import App from 'resource:///com/github/Aylur/ags/app.js';
import { USER } from 'resource:///com/github/Aylur/ags/utils.js';
import options from '../options.js';
import themes from '../themes.js';
import { reloadScss } from './scss.js';
import { setupHyprland } from './hyprland.js';
import { wallpaper } from './wallpaper.js';

/** @param {string} name */
export function setTheme(name) {
    options.reset();
    const theme = themes.find(t => t.name === name);
    if (!theme)
        return print('No theme named ' + name);

    options.apply(theme.options);
    reloadScss();
    setupHyprland();
    wallpaper();
}

export const WP = `/home/${USER}/Pictures/Wallpapers/`;

export const lightColors = {
    'color.scheme': 'light',
    'color.red': '#e55f86',
    'color.green': '#00D787',
    'color.yellow': '#EBFF71',
    'color.blue': '#51a4e7',
    'color.magenta': '#9077e7',
    'color.teal': '#51e6e6',
    'color.orange': '#E79E64',
    'color.bg': '#fffffa',
    'color.fg': '#141414',
    'hover_fg': '#0a0a0a',
};

export const Theme = ({ name, icon = ' ', ...options }) => ({
    name,
    icon,
    options: {
        'theme.name': name,
        'theme.icon': icon,
        ...options,
    },
});

export function openSettings() {
    App.openWindow('settings-dialog');
}
