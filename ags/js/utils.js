import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import cairo from 'cairo';
import options from './options.js';
import icons from './icons.js';
import Theme from './services/theme/theme.js';
import Gdk from 'gi://Gdk';

/**
  * @param {number} length
  * @param {number=} start
  * @returns {Array<number>}
  */
export function range(length, start = 1) {
    return Array.from({ length }, (_, i) => i + start);
}

/**
  * @param {Array<[string, string]>} collection
  * @param {string} item
  * @returns {string}
  */
export function substitute(collection, item) {
    return collection.find(([from]) => from === item)?.[1] || item;
}

/**
  * @param {(monitor: number) => any} widget
  * @returns {Array<import('types/widgets/window').default>}
  */
export function forMonitors(widget) {
    const n = Gdk.Display.get_default()?.get_n_monitors() || 1;
    return range(n, 0).map(widget);
}

/**
  * @param {import('gi://Gtk').Gtk.Widget} widget
  * @returns {any} - missing cairo type
  */
export function createSurfaceFromWidget(widget) {
    const alloc = widget.get_allocation();
    const surface = new cairo.ImageSurface(
        cairo.Format.ARGB32,
        alloc.width,
        alloc.height,
    );
    const cr = new cairo.Context(surface);
    cr.setSourceRGBA(255, 255, 255, 0);
    cr.rectangle(0, 0, alloc.width, alloc.height);
    cr.fill();
    widget.draw(cr);

    return surface;
}

export function warnOnLowBattery() {
    const { low } = options.battaryBar;
    Battery.connect('notify::percent', () => {
        if (Battery.percent === low || Battery.percent === low / 2) {
            Utils.execAsync([
                'notify-send',
                `${Battery.percent}% Battery Percentage`,
                '-i', icons.battery.warning,
                '-u', 'critical',
            ]);
        }
    });
}

/** @param {string} icon */
export function getAudioTypeIcon(icon) {
    const substitues = [
        ['audio-headset-bluetooth', icons.audio.type.headset],
        ['audio-card-analog-usb', icons.audio.type.speaker],
        ['audio-card-analog-pci', icons.audio.type.card],
    ];

    for (const [from, to] of substitues) {
        if (from === icon)
            return to;
    }

    return icon;
}

export function scssWatcher() {
    return Utils.subprocess(
        [
            'inotifywait',
            '--recursive',
            '--event', 'create,modify',
            '-m', App.configDir + '/scss',
        ],
        () => Theme.setup(),
        () => print('missing dependancy for css hotreload: inotify-tools'),
    );
}

export function activePlayer() {
    Mpris.connect('player-added', (mpris, bus) => {
        mpris.getPlayer(bus)?.connect('changed', player => {
            globalThis.mpris = player || Mpris.players[0];
        });
    });
}

export async function globalServices() {
    globalThis.audio = Audio;
    globalThis.recorder = (await import('./services/screenrecord.js')).default;
    globalThis.brightness = (await import('./services/brightness.js')).default;
    globalThis.indicator = (await import('./services/onScreenIndicator.js')).default;
    globalThis.theme = (await import('./services/theme/theme.js')).default;
}

/**
  * @param {import('types/service/applications').Application} app
  */
export function launchApp(app) {
    Utils.execAsync(['hyprctl', 'dispatch', 'exec', `sh -c ${app.executable}`]);
    app.frequency += 1;
}
