import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import options from '../options.js';
import icons from '../icons.js';
import { reloadScss } from './scss.js';
import { setupHyprland } from './hyprland.js';
import { timeout } from 'resource:///com/github/Aylur/ags/utils.js';
import Gtk from 'gi://Gtk';

export function init() {
    try {
        Utils.exec('swww init');
    } catch (error) {
        print('missing dependancy: swww');
    }

    gtkSettings();
    notificationBlacklist();
    warnOnLowBattery();
    activePlayer();
    globals();
    tmux();
    gsettigsColorScheme();
    wallpaper();

    timeout(5, () => {
        reloadScss();
        setupHyprland();
    });

    options.bar.style.connect('changed', setupHyprland);
}

export function scssWatcher() {
    return Utils.subprocess(
        [
            'inotifywait',
            '--recursive',
            '--event', 'create,modify',
            '-m', App.configDir + '/scss',
        ],
        reloadScss,
        () => print('missing dependancy for css hotreload: inotify-tools'),
    );
}

function tmux() {
    if (!Utils.exec('which tmux'))
        return;

    options.accent.accent.connect('changed', ({ value }) => {
        Utils.execAsync(`tmux set @main_accent ${value.replace('$', '')}`);
    });
}

function gsettigsColorScheme() {
    if (!Utils.exec('which gsettings'))
        return;

    options.color.scheme.connect('changed', ({ value }) => {
        const gsettings = 'gsettings set org.gnome.desktop.interface color-scheme';
        Utils.execAsync(`${gsettings} "prefer-${value ? 'dark' : 'light'}"`);
    });
}

function wallpaper() {
    if (!Utils.exec('which gsettings'))
        return;

    options.desktop.wallpaper.connect('changed', ({ value }) => {
        Utils.execAsync([
            'swww', 'img',
            '--transition-type', 'grow',
            '--transition-pos', Utils.exec('hyprctl cursorpos').replace(' ', ''),
            value,
        ]).catch(err => console.error(err));
    });
}

function gtkSettings() {
    const settings = Gtk.Settings.get_default();
    if (!settings) {
        console.error(Error('Gtk.Settings unavailable'));
        return;
    }

    settings.connect('notify::gtk-font-name', () => {
        print(settings.gtk_font_name);
    });

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
        options.notifications.blackList.value.forEach(item => {
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

function activePlayer() {
    Mpris.connect('player-added', (mpris, bus) => {
        mpris.getPlayer(bus)?.connect('changed', player => {
            globalThis.mpris = player || Mpris.players[0];
        });
    });
}

async function globals() {
    globalThis.app = (await import('resource:///com/github/Aylur/ags/app.js')).default;
    globalThis.audio = (await import('resource:///com/github/Aylur/ags/service/audio.js')).default;
    globalThis.recorder = (await import('../services/screenrecord.js')).default;
    globalThis.brightness = (await import('../services/brightness.js')).default;
    globalThis.indicator = (await import('../services/onScreenIndicator.js')).default;
}
