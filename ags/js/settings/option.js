import { Variable } from 'resource:///com/github/Aylur/ags/variable.js';
import { CACHE_DIR, readFile, timeout, writeFile } from 'resource:///com/github/Aylur/ags/utils.js';
import { exec } from 'resource:///com/github/Aylur/ags/utils.js';
import options from '../options.js';
import { reloadScss } from './scss.js';
const CACHE_FILE = CACHE_DIR + '/options.json';

/**
 * @template T
 * @typedef {Object} OptionConfig<T>
 * @property {string=} scss - name of scss variable set to "exclude" to not include it in the generated scss file
 * @property {string=} unit - unit on numbers, default is "px"
 * @property {string=} summary
 * @property {string=} description
 * @property {boolean=} reload - set to false to not reload scss and hyprland
 * @property {(value: T) => any=} format
 */

/**
 * @template T
 * @typedef {Variable<T> & OptionConfig<T> & {
 *   id: string,
 *   reset: () => void,
 *   _readCache?: boolean
 * }} Option<T>
 */

/** object that holds the overriedden values */
let cacheObj = JSON.parse(readFile(CACHE_FILE) || '{}');

/**
 * Option ids are generated from their position in the options object
 * In order for them to read their cached value a timeout is needed
 * for the options object to initialize
 */
timeout(1, () => optionsList().forEach(opt => {
    if (opt.id && cacheObj[opt.id] !== undefined)
        opt.setValue(cacheObj[opt.id]);

    opt._readCache = true;
}));

/**
 * make a Variable that will cache its value
 *
 * @template T
 * @param {T} value
 * @param {OptionConfig<T> =} config
 * @returns {Option<T>}
 */
export function Option(value, {
    summary,
    description,
    scss,
    format,
    unit = 'px',
    reload = true,
} = {}) {
    const option = Object.assign(new Variable(value), {
        summary,
        description,
        scss,
        unit,
        format,
        id: '',
        reset: () => {
            if (option.value !== value)
                option.value = value;
        },
        _readCache: false,
    });

    option.connect('notify::value', () => {
        cacheObj[option.id] = option.value;
        writeFile(
            JSON.stringify(cacheObj, null, 2),
            CACHE_FILE,
        );

        if (option._readCache && reload)
            reloadScss();
    });

    return option;
}

export function resetOptions() {
    exec(`rm -rf ${CACHE_FILE}`);
    cacheObj = JSON.parse(readFile(CACHE_FILE) || '{}');
    optionsList().forEach(opt => opt.reset());
    reloadScss();
}

/** @returns {Array<Option<any>>} */
export function optionsList(object = options, path = '') {
    return Object.keys(object).flatMap(key => {
        /** @type Option<any> */
        const obj = object[key];
        const id = path ? path + '.' + key : key;

        if (obj instanceof Variable) {
            obj.id = id;
            return obj;
        }

        if (typeof obj === 'object')
            return optionsList(obj, id);

        return [];
    });
}
