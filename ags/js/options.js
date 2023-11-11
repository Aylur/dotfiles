/**
 * An object holding Options that are Variables with cached values.
 *
 * to update an option at runtime simply run
 * ags -r "options.path.to.option.setValue('value')"
 *
 * resetting:
 * ags -r "options.reset()"
 */

import { Option, resetOptions } from './settings/option.js';
import { USER } from 'resource:///com/github/Aylur/ags/utils.js';

const options = {
    reset: resetOptions,

    spacing: Option(8),
    padding: Option(9),
    radii: Option(9),
    transition: Option(200, { unit: 'ms' }),

    font: {
        font: Option('Ubuntu Nerd Font', { scss: 'font' }),
        mono: Option('Mononoki Nerd Font', { scss: 'mono-font' }),
        size: Option(13, { scss: 'font-size', unit: 'pt' }),
    },

    popover: {
        padding: { multiplier: Option(1.4, { unit: '' }) },
    },

    color: {
        red: Option('#e55f86', { scss: 'red' }),
        green: Option('#00D787', { scss: 'green' }),
        yellow: Option('#EBFF71', { scss: 'yellow' }),
        blue: Option('#51a4e7', { scss: 'blue' }),
        magenta: Option('#9077e7', { scss: 'magenta' }),
        teal: Option('#51e6e6', { scss: 'teal' }),
        orange: Option('#E79E64', { scss: 'orange' }),

        scheme: Option('dark'),
        bg: Option('#171717', { scss: 'bg-color' }),
        fg: Option('#eee', { scss: 'fg-color' }),
    },

    hover_fg: Option('#fff', { scss: 'hover-fg' }),
    shader_fg: Option('$fg-color', { scss: 'shader-fg' }),

    accent: {
        accent: Option('$blue', { scss: 'accent' }),
        fg: Option('#141414'),
        gradient: Option('to right, $accent, lighten($accent, 6%)'),
    },

    widget: {
        bg: Option('$fg_color', { scss: '_widget-bg' }),
        opacity: Option(94, { unit: '' }),
    },

    border: {
        color: Option('$fg_color', { scss: '_border-color' }),
        opacity: Option(97, { unit: '' }),
        width: Option(1),
    },

    hypr: {
        active_border: Option('rgba(3f3f3fFF)', { scss: 'exclude' }),
        inactive_border: Option('rgba(3f3f3fDD)', { scss: 'exclude' }),
        wm_gaps: Option(22, { scss: 'wm-gaps' }),
    },

    shadow: Option('rgba(0, 0, 0, .6)'),
    drop_shadow: Option(true, { scss: 'drop-shadow' }),
    avatar: Option(`/home/${USER}/Pictures/avatars/donna.jpg`, { format: v => `"${v}"` }),

    applauncher: {
        width: Option(500, { reload: false }),
        height: Option(500, { reload: false }),
        iconSize: Option(52, { reload: false }),
    },

    bar: {
        separators: Option(true, { reload: false }),
        style: Option('normal'),
        flat_buttons: Option(false, { scss: 'bar-flat-buttons' }),
    },

    battery: {
        showPercentage: Option(true, { reload: false }),
        bar: {
            width: Option(70),
            height: Option(14),
        },
        low: Option(30),
        medium: Option(50),
    },

    desktop: {
        fg_color: Option('#fff', { scss: 'wallpaper-fg' }),
        wallpaper: Option(`/home/${USER}/Pictures/Wallpapers/kitty.jpeg`, { format: v => `"${v}"` }),
        screen_corners: Option(true, { scss: 'screen-corners' }),
        clock: {
            enable: Option(true),
            position: Option('center center'),
        },
    },

    dock: {
        iconSize: Option(56),
        pinnedApps: Option([
            'firefox',
            'org.wezfurlong.wezterm',
            'org.gnome.Nautilus',
            'org.gnome.Calendar',
            'obsidian',
            'transmission-gtk',
            'caprine',
            'teams-for-linux',
            'discord',
            'spotify',
            'com.usebottles.bottles',
            'org.gnome.Software',
        ], { scss: 'exclude' }),
    },

    notifications: {
        blackList: Option(['Spotify']), // app-name | app-entry
        width: Option(450),
    },

    dashboard: {
        sys_info_size: Option(70, { scss: 'sys-info-size' }),
    },

    mpris: {
        blackList: Option(['Caprine'], {
            'description': 'bus-name | name | identity | entry',
        }),
        preferred: Option('spotify', {
            'summary': 'Preferred player on the bar',
        }),
    },

    workspaces: Option(7, {
        'summary': 'No. workspaces on bar and overview',
        'description': 'Set it to 0 to make it dynamic',
    }),

    temperature: '/sys/class/thermal/thermal_zone0/temp',
    systemFetchInterval: 5000,
    brightnessctlKBD: 'asus::kbd_backlight',
    substitutions: {
        icons: [
            ['transmission-gtk', 'transmission'],
            ['blueberry.py', 'bluetooth'],
            ['org.wezfurlong.wezterm', 'folder-code'],
            ['com.raggesilver.BlackBox', 'folder-code'],
            ['Caprine', 'facebook-messenger'],
            ['', 'preferences-desktop-display'],
        ],
        titles: [
            ['transmission-gtk', 'Transmission'],
            ['com.obsproject.Studio', 'OBS'],
            ['com.usebottles.bottles', 'Bottles'],
            ['com.github.wwmm.easyeffects', 'Easy Effects'],
            ['org.gnome.TextEditor', 'Text Editor'],
            ['org.gnome.design.IconLibrary', 'Icon Library'],
            ['blueberry.py', 'Blueberry'],
            ['org.wezfurlong.wezterm', 'Wezterm'],
            ['com.raggesilver.BlackBox', 'BlackBox'],
            ['firefox', 'Firefox'],
            ['org.gnome.Nautilus', 'Files'],
            ['libreoffice-writer', 'Writer'],
            ['', 'Desktop'],
        ],
    },
};

globalThis.options = options;
export default options;
