import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import options from '../options.js';
import icons from '../icons.js';
import { reloadScss, scssWatcher } from './scss.js';
import { wallpaper } from './wallpaper.js';
import { hyprlandInit, setupHyprland } from './hyprland.js';
import { globals } from './globals.js';
import { showAbout } from '../about/about.js';
import Gtk from 'gi://Gtk';

export function init() {
    notificationBlacklist();
    warnOnLowBattery();
    globals();
    tmux();
    gsettigsColorScheme();
    gtkFontSettings();
    scssWatcher();
    dependandOptions();

    reloadScss();
    hyprlandInit();
    setupHyprland();
    wallpaper();
    showAbout();
}

function dependandOptions() {
    options.bar.style.connect('changed', ({ value }) => {
        if (value !== 'normal')
            options.desktop.screen_corners.setValue(false, true);
    });
}

function tmux() {
    if (!Utils.exec('which tmux'))
        return;

    /** @param {string} scss */
    function getColor(scss) {
        if (scss.includes('#'))
            return scss;

        if (scss.includes('$')) {
            const opt = options.list().find(opt => opt.scss === scss.replace('$', ''));
            return opt?.value;
        }
    }

    options.theme.accent.accent.connect('changed', ({ value }) => Utils
        .execAsync(`tmux set @main_accent ${getColor(value)}`)
        .catch(err => console.error(err.message)));
}

function gsettigsColorScheme() {
    if (!Utils.exec('which gsettings'))
        return;

    options.theme.scheme.connect('changed', ({ value }) => {
        const gsettings = 'gsettings set org.gnome.desktop.interface color-scheme';
        Utils.execAsync(`${gsettings} "prefer-${value}"`)
            .catch(err => console.error(err.message));
    });
}

function gtkFontSettings() {
    const settings = Gtk.Settings.get_default();
    if (!settings) {
        console.error(Error('Gtk.Settings unavailable'));
        return;
    }

    const callback = () => {
        const { size, font } = options.font;
        settings.gtk_font_name = `${font.value} ${size.value}`;
    };

    options.font.font.connect('notify::value', callback);
    options.font.size.connect('notify::value', callback);
}

function notificationBlacklist() {
    Notifications.connect('notified', (_, id) => {
        const n = Notifications.getNotification(id);
        options.notifications.black_list.value.forEach(item => {
            if (n?.app_name.includes(item) || n?.app_entry?.includes(item))
                n.close();
        });
    });
}

function warnOnLowBattery() {
    Battery.connect('notify::percent', () => {
        const low = options.battery.low.value;
        if (Battery.percent !== low ||
            Battery.percent !== low / 2 ||
            !Battery.charging)
            return;

        Utils.execAsync([
            'notify-send',
            `${Battery.percent}% Battery Percentage`,
            '-i', icons.battery.warning,
            '-u', 'critical',
        ]);
    });
}
