import App from 'resource:///com/github/Aylur/ags/app.js';
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

export const WP = App.configDir + '/assets/';

export const lightColors = {
    'theme.scheme': 'light',
    'color.red': '#e55f86',
    'color.green': '#00D787',
    'color.yellow': '#EBFF71',
    'color.blue': '#51a4e7',
    'color.magenta': '#9077e7',
    'color.teal': '#51e6e6',
    'color.orange': '#E79E64',
    'theme.bg': '#fffffa',
    'theme.fg': '#141414',
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

let settingsDialog;
export async function openSettings() {
    if (settingsDialog)
        return settingsDialog.present();

    try {
        settingsDialog = (await import('./SettingsDialog.js')).default;
        settingsDialog.present();
    } catch (error) {
        if (error instanceof Error)
            console.error(error.message);
    }
}
