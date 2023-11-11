import App from 'resource:///com/github/Aylur/ags/app.js';
import { execAsync, exec } from 'resource:///com/github/Aylur/ags/utils.js';
import options from '../options.js';

const noAlphaignore = ['verification', 'powermenu', 'lockscreen'];

/** @param {Array<string>} args */
const keyword = (...args) => execAsync(['hyprctl', 'keyword', ...args]);

export function setupHyprland() {
    const wm_gaps = options.hypr.wm_gaps.value;
    const border_width = options.border.width.value;
    const active_border = options.hypr.active_border.value;
    const inactive_border = options.hypr.inactive_border.value;
    const radii = options.radii.value;
    const drop_shadow = options.drop_shadow.value;
    const bar_style = options.bar.style.value;

    try {
        App.connect('config-parsed', () => {
            for (const [name] of App.windows) {
                keyword('layerrule', `unset, ${name}`).then(() => {
                    keyword('layerrule', `blur, ${name}`);
                    if (!noAlphaignore.every(skip => !name.includes(skip)))
                        return;

                    keyword('layerrule', `ignorealpha 0.6, ${name}`);
                });
            }
        });

        JSON.parse(exec('hyprctl -j monitors')).forEach(({ name }) => {
            if (bar_style !== 'normal')
                keyword('monitor', `${name},addreserved,-${wm_gaps},0,0,0`);
            else
                keyword('monitor', `${name},addreserved,0,0,0,0`);
        });

        keyword('general:border_size', `${border_width}`);
        keyword('general:gaps_out', `${wm_gaps}`);
        keyword('general:gaps_in', `${wm_gaps / 2}`);
        keyword('general:col.active_border', `${active_border}`);
        keyword('general:col.inactive_border', `${inactive_border}`);
        keyword('decoration:rounding', `${radii}`);
        keyword('decoration:drop_shadow', `${drop_shadow ? 'yes' : 'no'}`);
    } catch (error) {
        console.error(error.message);
    }
}
