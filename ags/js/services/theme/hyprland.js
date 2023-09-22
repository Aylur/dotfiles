const { App } = ags;
const { Hyprland } = ags.Service;
const { execAsync } = ags.Utils;

const noAlphaignore = ['verification', 'powermenu', 'lockscreen'];

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
        App.instance.connect('config-parsed', () => {
            for (const [name] of App.windows) {
                execAsync(['hyprctl', 'keyword', 'layerrule', `unset, ${name}`]).then(() => {
                    execAsync(['hyprctl', 'keyword', 'layerrule', `blur, ${name}`]);
                    if (!noAlphaignore.every(skip => !name.includes(skip)))
                        return;

                    execAsync(['hyprctl', 'keyword', 'layerrule', `ignorealpha 0.6, ${name}`]);
                });
            }
        });


        Hyprland.HyprctlGet('monitors').forEach(({ name }) => {
            if (bar_style !== 'normal') {
                switch (layout) {
                    case 'topbar':
                    case 'unity':
                        execAsync(`hyprctl keyword monitor ${name},addreserved,-${wm_gaps},0,0,0`);
                        break;

                    case 'bottombar':
                        execAsync(`hyprctl keyword monitor ${name},addreserved,0,-${wm_gaps},0,0`);
                        break;

                    default: break;
                }
            } else {
                execAsync(`hyprctl keyword monitor ${name},addreserved,0,0,0,0`);
            }
        });

        execAsync(`hyprctl keyword general:border_size ${border_width}`);
        execAsync(`hyprctl keyword general:gaps_out ${wm_gaps}`);
        execAsync(`hyprctl keyword general:gaps_in ${wm_gaps / 2}`);
        execAsync(`hyprctl keyword general:col.active_border ${hypr_active_border}`);
        execAsync(`hyprctl keyword general:col.inactive_border ${hypr_inactive_border}`);
        execAsync(`hyprctl keyword decoration:rounding ${radii}`);
        execAsync(`hyprctl keyword decoration:drop_shadow ${drop_shadow ? 'yes' : 'no'}`);
    } catch (error) {
        console.error(error);
    }
}
