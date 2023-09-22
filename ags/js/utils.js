import Cairo from 'cairo';
import options from './options.js';
import icons from './icons.js';
import Theme from './services/theme/theme.js';

export function forMonitors(widget) {
    const ws = ags.Service.Hyprland.HyprctlGet('monitors');
    return ws.map(mon => widget(mon.id));
}

export function createSurfaceFromWidget(widget) {
    const alloc = widget.get_allocation();
    const surface = new Cairo.ImageSurface(
        Cairo.Format.ARGB32,
        alloc.width,
        alloc.height,
    );
    const cr = new Cairo.Context(surface);
    cr.setSourceRGBA(255, 255, 255, 0);
    cr.rectangle(0, 0, alloc.width, alloc.height);
    cr.fill();
    widget.draw(cr);

    return surface;
}

export function warnOnLowBattery() {
    const { Battery } = ags.Service;
    Battery.instance.connect('changed', () => {
        const { low } = options.battaryBar;
        if (Battery.percentage < low || Battery.percentage < low / 2) {
            ags.Utils.execAsync([
                'notify-send',
                `${Battery.percentage}% Battery Percentage`,
                '-i', icons.battery.warning,
                '-u', 'critical',
            ]);
        }
    });
}

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
    return ags.Utils.subprocess([
        'inotifywait',
        '--recursive',
        '--event', 'create,modify',
        '-m', ags.App.configDir + '/scss',
    ], Theme.setup);
}
