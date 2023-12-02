import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import { Variable } from 'resource:///com/github/Aylur/ags/variable.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import Service from 'resource:///com/github/Aylur/ags/service.js';
import { dependencies } from '../utils.js';

const COLORS_CACHE = Utils.CACHE_DIR + '/colorpicker.json';

class Colors extends Service {
    static {
        Service.register(this, {}, {
            'colors': ['jsobject'],
        });
    }

    /** @type {Variable<string[]>} */
    #colors = new Variable([]);
    get colors() { return this.#colors.value; }

    #notifID = 0;

    constructor() {
        super();

        this.#colors.connect('changed', () => this.changed('colors'));

        Utils.readFileAsync(COLORS_CACHE)
            .then(out => this.#colors.setValue(JSON.parse(out || '[]')))
            .catch(() => print('no colorpicker cache found'));
    }

    /** @param {string} color */
    wlCopy(color) {
        Utils.execAsync(['wl-copy', color])
            .catch(err => console.error(err));
    }

    async pick() {
        if (!dependencies(['hyprpicker']))
            return;

        const color = await Utils.execAsync('hyprpicker');
        if (!color)
            return;

        this.wlCopy(color);
        const list = this.#colors.value;
        if (!list.includes(color)) {
            list.push(color);
            if (list.length > 10)
                list.shift();

            this.#colors.value = list;
            Utils.writeFile(JSON.stringify(list, null, 2), COLORS_CACHE)
                .catch(err => console.error(err));
        }

        this.#notifID = Notifications.Notify(
            'Color Picker',
            this.#notifID,
            'color-select-symbolic',
            color, '', [], {},
        );
    }
}

export default new Colors;
