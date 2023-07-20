/* exported config */
const { exec } = ags.Utils;

const layout = imports.settings.service.Settings.layout;
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

        ...imports.layouts[layout].windows,
    ],
};

ags.App.instance.connect('config-parsed', () => {
    for (const [name] of ags.App.windows) {
        if (!name.includes('desktop')) {
            exec(`hyprctl keyword layerrule "unset, ${name}"`);
            exec(`hyprctl keyword layerrule "blur, ${name}"`);
            exec(`hyprctl keyword layerrule "ignorealpha 0.6, ${name}"`);
        }
    }
});
