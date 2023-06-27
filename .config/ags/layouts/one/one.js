const static = imports.layouts.one.windows;
const popups = imports.layouts.one.popups;

var windows = wallpapers => ([
    ...ags.Service.Hyprland.HyprctlGet('monitors').map(({ id }) => ([
        static.dock(id),
        static.notifications(id),
        static.windowcorners(id),
        static.desktop(id, wallpapers),
        static.indicator(id),
        static.bar(id),
    ])).flat(),
    popups.applauncher(wallpapers),
    popups.datemenu,
    popups.media,
    popups.overview,
    popups.powermenu,
    popups.verification,
    popups.quicksettings,
]);
