import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import Service from 'resource:///com/github/Aylur/ags/service.js';
import options from '../options.js';
import { dependencies } from '../utils.js';

const KBD = options.brightnessctlKBD;

class Brightness extends Service {
    static {
        Service.register(this, {}, {
            'screen': ['float', 'rw'],
            'kbd': ['int', 'rw'],
        });
    }

    #kbd = 0;
    #kbdMax = 3;
    #screen = 0;

    get kbd() { return this.#kbd; }
    get screen() { return this.#screen; }

    set kbd(value) {
        if (!dependencies(['brightnessctl']))
            return;

        if (value < 0 || value > this.#kbdMax)
            return;

        Utils.execAsync(`brightnessctl -d ${KBD} s ${value} -q`)
            .then(() => {
                this.#kbd = value;
                this.changed('kbd');
            })
            .catch(console.error);
    }

    set screen(percent) {
        if (!dependencies(['brightnessctl']))
            return;

        if (percent < 0)
            percent = 0;

        if (percent > 1)
            percent = 1;

        Utils.execAsync(`brightnessctl s ${percent * 100}% -q`)
            .then(() => {
                this.#screen = percent;
                this.changed('screen');
            })
            .catch(console.error);
    }

    constructor() {
        super();

        if (dependencies(['brightnessctl'])) {
            this.#kbd = Number(Utils.exec(`brightnessctl -d ${KBD} g`));
            this.#kbdMax = Number(Utils.exec(`brightnessctl -d ${KBD} m`));
            this.#screen = Number(Utils.exec('brightnessctl g')) / Number(Utils.exec('brightnessctl m'));
        }
    }
}


export default new Brightness();
