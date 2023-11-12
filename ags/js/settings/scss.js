import App from 'resource:///com/github/Aylur/ags/app.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import { getOptions } from './option.js';

/**
 * generate an scss file that makes every option available as a variable
 * based on the passed scss parameter or the path in the object
 *
 * e.g
 * options.bar.style.value => $bar-style
 */
export async function reloadScss() {
    const opts = getOptions();
    const vars = opts.map(opt => {
        if (opt.scss === 'exclude')
            return '';

        const name = opt.id.split('.').join('-');
        const unit = typeof opt.value === 'number' ? opt.unit : '';
        const value = opt.format ? opt.format(opt.value) : opt.value;
        return `$${opt.scss || name}: ${value}${unit};`;
    });

    const bar_style = opts.find(opt => opt.id === 'bar.style')?.value || '';
    const additional = bar_style === 'normal' ? '//' : `
        window#quicksettings .window-content {
            margin-right: $wm-gaps;
        }

        window#quicksettings .window-content,
        window#dashboard .window-content {
            margin-top: 0;
        }
    `;

    const tmp = '/tmp/ags/scss';
    Utils.ensureDirectory(tmp);
    try {
        await Utils.writeFile(vars.join('\n'), `${tmp}/options.scss`);
        await Utils.writeFile(additional, `${tmp}/additional.scss`);
        await Utils.execAsync(`sassc ${App.configDir}/scss/main.scss ${tmp}/style.css`);
        App.resetCss();
        App.applyCss(`${tmp}/style.css`);
    } catch (error) {
        console.error(error);
    }
}
