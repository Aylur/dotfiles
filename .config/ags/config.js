const { CONFIG_DIR, exec } = ags.Utils;

exec(`sassc ${CONFIG_DIR}/scss/dark.scss ${CONFIG_DIR}/dark.css`);
exec(`sassc ${CONFIG_DIR}/scss/light.scss ${CONFIG_DIR}/light.css`);

Object.keys(imports.widgets).forEach(m => imports.widgets[m]);

var config = {
    baseIconSize: 18,
    closeWindowDelay: {
        'datemenu': 500,
        'dashboard': 500,
        'quicksettings': 500,
        'media': 500,
    },
    windows: [
        ...ags.Service.Hyprland.HyprctlGet('monitors').map(({ id }) => ([
            imports.layouts.shared.indicator(id),
        ])).flat(),
        imports.layouts.shared.powermenu,
        imports.layouts.shared.verification,
        imports.layouts.shared.overview,
        imports.layouts.shared.applauncher,

        // layout
        ...imports.layouts.three.windows,
    ],
};
