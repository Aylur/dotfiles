import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import cairo from 'cairo';
import icons from './icons.js';
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
  * @param {Array<[string, string] | string[]>} collection
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
    return range(n, 0).map(widget).flat(1);
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

/** @param {string} icon */
export function getAudioTypeIcon(icon) {
    const substitues = [
        ['audio-headset-bluetooth', icons.audio.type.headset],
        ['audio-card-analog-usb', icons.audio.type.speaker],
        ['audio-card-analog-pci', icons.audio.type.card],
    ];

    return substitute(substitues, icon);
}


/** @param {import('types/service/applications').Application} app */
export function launchApp(app) {
    Utils.execAsync(['hyprctl', 'dispatch', 'exec', `sh -c ${app.executable}`]);
    app.frequency += 1;
}

/** @param {Array<string>} bins */
export function dependencies(bins) {
    const deps = bins.map(bin => {
        const has = Utils.exec(`which ${bin}`);
        if (!has)
            print(`missing dependency: ${bin}`);

        return !!has;
    });

    return deps.every(has => has);
}
