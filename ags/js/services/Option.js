import { Variable } from 'resource:///com/github/Aylur/ags/variable.js';
import { CACHE_DIR, readFile, writeFile } from 'resource:///com/github/Aylur/ags/utils.js';

const CACHE_FILE = CACHE_DIR + '/options.json';

/** object that holds the overriedden values */
const cacheObj = JSON.parse(readFile(CACHE_FILE) || '{}');

/**
 * get the object and the key that holds the overriedden value
 *
 * @param {Array<string>} path
 * @param {Record<string, any>} obj
 * @returns {[Record<string, any>, string]}
 */
function narrow(path, obj = cacheObj) {
    const [head, ...tail] = path;

    if (tail.length === 0)
        return [obj, head];

    if (tail && !obj[head])
        obj[head] = {};

    return narrow(tail, obj[head]);
}

/**
 * make a Variable that will cache its value
 *
 * @param {any} value
 * @param {string} path - path in the cache object
 * @returns {Variable}
 */
export default function Option(value, path) {
    const [cache, key] = narrow(path.split('.'));

    const variable = new Variable(
        cache[key] === undefined ? value : cache[key],
    );

    variable.connect('notify::value', () => {
        cache[key] = variable.value;
        writeFile(
            JSON.stringify(cacheObj, null, 2),
            CACHE_FILE,
        );
    });

    return variable;
}
