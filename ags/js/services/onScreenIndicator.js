import icons from '../icons.js';
import { getAudioTypeIcon } from '../utils.js';
const { Service } = ags;
const { timeout, connect } = ags.Utils;

class IndicatorService extends Service {
    static {
        Service.register(this, {
            'popup': ['double', 'string'],
        });
    }

    _delay = 1500;
    _count = 0;

    popup(value, icon) {
        this.emit('popup', value, icon);
        this._count++;
        timeout(this._delay, () => {
            this._count--;

            if (this._count === 0)
                this.emit('popup', -1, icon);
        });
    }

    speaker() {
        this.popup(
            ags.Service.Audio.speaker.volume,
            getAudioTypeIcon(ags.Service.Audio.speaker.iconName),
        );
    }

    display() {
        // brightness is async, so lets wait a bit
        timeout(10, () => this.popup(
            ags.Service.Brightness.screen,
            icons.brightness.screen));
    }

    kbd() {
        // brightness is async, so lets wait a bit
        timeout(10, () => this.popup(
            (ags.Service.Brightness.kbd * 33 + 1) / 100,
            icons.brightness.keyboard));
    }

    connectWidget(widget, callback) {
        connect(this, widget, callback, 'popup');
    }
}

export default class Indicator {
    static { Service.Indicator = this; }
    static instance = new IndicatorService();
    static popup(value, icon) { Indicator.instance.popup(value, icon); }
    static speaker() { Indicator.instance.speaker(); }
    static display() { Indicator.instance.display(); }
    static kbd() { Indicator.instance.kbd(); }
}
