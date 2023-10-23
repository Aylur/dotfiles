import { Service, Utils } from '../imports.js';
import options from '../options.js';
const KBD = options.brightnessctlKBD;

class Brightness extends Service {
    static {
        Service.register(this, {}, {
            'screen': ['float', 'rw'],
            'kbd': ['int', 'rw'],
        });
    }

    _kbd = 0;
    _screen = 0;

    get kbd() { return this._kbd; }
    get screen() { return this._screen; }

    set kbd(value) {
        if (value < 0 || value > this._kbdMax)
            return;

        Utils.execAsync(`brightnessctl -d ${KBD} s ${value} -q`)
            .then(() => {
                this._kbd = value;
                this.changed('kbd');
            })
            .catch(console.error);
    }

    set screen(percent) {
        if (percent < 0)
            percent = 0;

        if (percent > 1)
            percent = 1;

        Utils.execAsync(`brightnessctl s ${percent * 100}% -q`)
            .then(() => {
                this._screen = percent;
                this.changed('screen');
            })
            .catch(console.error);
    }

    constructor() {
        super();
        try {
            this._kbd = Number(Utils.exec(`brightnessctl -d ${KBD} g`));
            this._kbdMax = Number(Utils.exec(`brightnessctl -d ${KBD} m`));
            this._screen = Number(Utils.exec('brightnessctl g')) / Number(Utils.exec('brightnessctl m'));
        } catch (error) {
            console.error('missing dependancy: brightnessctl');
        }
    }
}

export default new Brightness();
