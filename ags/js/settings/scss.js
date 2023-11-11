import App from 'resource:///com/github/Aylur/ags/app.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import { optionsList } from './option.js';

/**
 * generate an scss file that makes every option available as a variable
 * based on the passed scss parameter or the path in the object
 *
 * e.g
 * options.bar.style.value => $bar-style
 */
export async function reloadScss() {
    const vars = optionsList().map(opt => {
        if (opt.scss === 'exclude')
            return '';

        const name = opt.id.split('.').join('-');
        const unit = typeof opt.value === 'number' ? opt.unit : '';
        const value = opt.format ? opt.format(opt.value) : opt.value;
        return `$${opt.scss || name}: ${value}${unit};`;
    });

    const tmp = '/tmp/ags/scss';
    Utils.ensureDirectory(tmp);
    try {
        await Utils.writeFile(vars.join('\n'), `${tmp}/options.scss`);
        await Utils.execAsync(`sassc ${App.configDir}/scss/main.scss ${tmp}/style.css`);
        App.resetCss();
        App.applyCss(`${tmp}/style.css`);
        print('css reloaded');
    } catch (error) {
        console.error(error);
    }
}
