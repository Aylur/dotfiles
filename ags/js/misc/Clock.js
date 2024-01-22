import { clock } from '../variables.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

/**
 * @param {import('types/widgets/label').Props & {
 *   format?: string,
 *   interval?: number,
 * }} o
 */
export default ({
    format = '%H:%M:%S %B %e. %A',
    ...rest
} = {}) => Widget.Label({
    class_name: 'clock',
    label: clock.bind('value').transform(time => {
        return time.format(format) || 'wrong format';
    }),
    ...rest,
});
