import App from 'resource:///com/github/Aylur/ags/app.js';
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import options from '../options.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';

const noAlphaignore = ['verification', 'powermenu', 'lockscreen'];

// FIXME: consider delaying this, to avoid lag at start
export function hyprlandInit() {
    for (const [name] of App.windows) {
        execAsync(['hyprctl', 'keyword', 'layerrule', `blur, ${name}`]).then(() => {
            if (!noAlphaignore.every(skip => !name.includes(skip)))
                return;

            execAsync(['hyprctl', 'keyword', 'layerrule', `ignorealpha 0.6, ${name}`]);
        }).catch(err => console.error(err.message));
    }
}

export async function setupHyprland() {
    const wm_gaps = options.hypr.wm_gaps_multiplier.value * options.spacing.value;
    const border_width = options.border.width.value;
    const active_border = options.hypr.active_border.value;
    const inactive_border = options.hypr.inactive_border.value;
    const radii = options.radii.value;
    const drop_shadow = options.desktop.drop_shadow.value;
    const bar_style = options.bar.style.value;

    const batch = [];

    JSON.parse(await Hyprland.sendMessage('j/monitors')).forEach(({ name }) => {
        if (bar_style !== 'normal')
            batch.push(`monitor ${name},addreserved,-${wm_gaps},0,0,0`);
        else
            batch.push(`monitor ${name},addreserved,0,0,0,0`);
    });

    batch.push(
        `general:border_size ${border_width}`,
        `general:gaps_out ${wm_gaps}`,
        `general:gaps_in ${wm_gaps / 2}`,
        `general:col.active_border ${active_border}`,
        `general:col.inactive_border ${inactive_border}`,
        `decoration:rounding ${radii}`,
        `decoration:drop_shadow ${drop_shadow ? 'yes' : 'no'}`,
    );

    const cmd = batch
        .map(x => `keyword ${x}`)
        .join('; ');

    Hyprland.sendMessage(`[[BATCH]]/${cmd}`)
        .catch(err => console.error(`Hyprland.sendMessage: ${err.message}`));
}
