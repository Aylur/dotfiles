const static = imports.layouts.two.windows;
const popups = imports.layouts.two.popups;

var windows = [
    ...ags.Service.Hyprland.HyprctlGet('monitors').map(({ id }) => ([
        static.dock(id),
        static.notifications(id),
        static.desktop(id),
        static.indicator(id),
        static.bar(id),
    ])).flat(),
    popups.applauncher,
    popups.dashboard,
    popups.overview,
    popups.powermenu,
    popups.verification,
    popups.quicksettings,
];
