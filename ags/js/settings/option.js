import { CACHE_DIR, readFile, writeFile } from 'resource:///com/github/Aylur/ags/utils.js';
import { exec } from 'resource:///com/github/Aylur/ags/utils.js';
import options from '../options.js';
import Service from 'resource:///com/github/Aylur/ags/service.js';
import { reloadScss } from './scss.js';
import { setupHyprland } from './hyprland.js';
const CACHE_FILE = CACHE_DIR + '/options.json';

/** object that holds the overriedden values */
let cacheObj = JSON.parse(readFile(CACHE_FILE) || '{}');

/**
 * @template T
 * @typedef {Object} OptionConfig
 * @property {string=} scss - name of scss variable set to "exclude" to not include it in the generated scss file
 * @property {string=} unit - unit on numbers, default is "px"
 * @property {string=} summary
 * @property {string=} description
 * @property {boolean=} noReload
 * @property {boolean=} persist - ignore reset call
 * @property {(value: T) => any=} format
 */

/** @template T */
class Opt extends Service {
    static {
        Service.register(this, {}, {
            'value': ['jsobject'],
        });
    }

    #value;
    unit = 'px';
    noReload = false;
    id = '';
    scss = '';
    /** @type {(v: T) => any} */format = v => v;

    /**
     * @param {T} value
     * @param {OptionConfig<T> =} config
     */
    constructor(value, config) {
        super();
        this.#value = value;
        this.defaultValue = value;

        if (config)
            Object.keys(config).forEach(c => this[c] = config[c]);

        import('../options.js').then(() => {
            getOptions(); // sets the ids as a side effect

            if (cacheObj[this.id] !== undefined)
                this.setValue(cacheObj[this.id]);

            this.connect('changed', () => {
                cacheObj[this.id] = this.value;
                writeFile(
                    JSON.stringify(cacheObj, null, 2),
                    CACHE_FILE,
                );
            });
        });
    }

    get value() { return this.#value; }
    set value(value) { this.setValue(value); }

    /** @param {T} value  */
    setValue(value, reload = false) {
        if (this.value !== value) {
            this.#value = value;
            this.changed('value');
        }

        if (reload && !this.noReload) {
            reloadScss();
            setupHyprland();
        }
    }

    reset() {
        this.setValue(this.defaultValue);
    }
}

/**
 * @template T
 * @param {T} value
 * @param {OptionConfig<T> =} config
 * @returns {Opt<T>}
 */
export function Option(value, config) {
    return new Opt(value, config);
}

/** @returns {Array<Opt<any>>} */
export function getOptions(object = options, path = '') {
    return Object.keys(object).flatMap(key => {
        /** @type Option<any> */
        const obj = object[key];
        const id = path ? path + '.' + key : key;

        if (obj instanceof Opt) {
            obj.id = id;
            return obj;
        }

        if (typeof obj === 'object')
            return getOptions(obj, id);

        return [];
    });
}

export function resetOptions() {
    exec(`rm -rf ${CACHE_FILE}`);
    cacheObj = {};
    getOptions().forEach(opt => opt.reset());
}

export function getValues() {
    const obj = {};
    for (const opt of getOptions())
        obj[opt.id] = opt.value;

    return JSON.stringify(obj, null, 2);
}

/** @param {string | object} config */
export function apply(config) {
    const options = getOptions();
    const settings = typeof config === 'string'
        ? JSON.parse(config) : config;

    for (const id of Object.keys(settings)) {
        const opt = options.find(opt => opt.id === id);
        if (!opt) {
            print(`No option with id: "${id}"`);
            continue;
        }

        opt.setValue(settings[id]);
    }
}
