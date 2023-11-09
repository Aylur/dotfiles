import App from 'resource:///com/github/Aylur/ags/app.js';
import { execAsync, exec } from 'resource:///com/github/Aylur/ags/utils.js';

const noAlphaignore = ['verification', 'powermenu', 'lockscreen'];

/** @param {Array<string>} args */
const keyword = (...args) => execAsync(['hyprctl', 'keyword', ...args]);

export default function({
    wm_gaps,
    border_width,
    hypr_active_border,
    hypr_inactive_border,
    radii,
    drop_shadow,
    bar_style,
    layout,
}) {
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
            if (bar_style !== 'normal') {
                switch (layout) {
                    case 'topbar':
                    case 'unity':
                        keyword('monitor', `${name},addreserved,-${wm_gaps},0,0,0`);
                        break;

                    case 'bottombar':
                        keyword('monitor', `${name},addreserved,0,-${wm_gaps},0,0`);
                        break;

                    default: break;
                }
            } else {
                keyword('monitor', `${name},addreserved,0,0,0,0`);
            }
        });

        keyword('general:border_size', `${border_width}`);
        keyword('general:gaps_out', `${wm_gaps}`);
        keyword('general:gaps_in', `${wm_gaps / 2}`);
        keyword('general:col.active_border', `${hypr_active_border}`);
        keyword('general:col.inactive_border', `${hypr_inactive_border}`);
        keyword('decoration:rounding', `${radii}`);
        keyword('decoration:drop_shadow', `${drop_shadow ? 'yes' : 'no'}`);
    } catch (error) {
        console.error(error);
    }
}
