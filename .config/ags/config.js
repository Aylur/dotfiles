/* exported config */
const { Theme } = imports.theme.theme;

Object.keys(imports.modules).forEach(m => imports.modules[m]);
Object.keys(imports.layouts.widgets).forEach(m => imports.layouts.widgets[m]);

var config = {
    baseIconSize: 20,
    stackTraceOnError: true,
    closeWindowDelay: {
        'dashboard': 350,
        'quicksettings': 350,
    },
    windows: [
        ...ags.Service.Hyprland.HyprctlGet('monitors').map(({ id }) => ([
            imports.layouts.shared.indicator(id),
        ])).flat(),
        imports.layouts.shared.powermenu,
        imports.layouts.shared.verification,
        imports.layouts.shared.overview,
        imports.layouts.shared.applauncher,

        ...imports.layouts[Theme.getSetting('layout')].windows,
    ],
};
