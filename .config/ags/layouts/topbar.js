const Shared = imports.layouts.shared;

// static windows
const dock = Shared.dock;
const notifications = monitor => Shared.notifications(monitor, 'slide_down', ['top']);
const desktop = Shared.desktop;
const corners = Shared.corners;

// popups
const dashboard = {
    name: 'dashboard',
    popup: true,
    focusable: true,
    anchor: ['top'],
    child: {
        type: 'layout',
        layout: 'top',
        window: 'dashboard',
        child: { type: 'dashboard/popup-content' },
    },
};

const quicksettings = {
    name: 'quicksettings',
    popup: true,
    focusable: true,
    anchor: ['top', 'right'],
    child: {
        type: 'layout',
        layout: 'topright',
        window: 'quicksettings',
        child: { type: 'quicksettings/popup-content' },
    },
};

// bar
const { launcher, bar } = imports.layouts.shared;
const separator = { type: 'separator', valign: 'center' };

const panel = bar({
    anchor: ['top', 'left', 'right'],
    start: [
        launcher(),
        separator,
        { type: 'workspaces', className: 'workspaces panel-button' },
        separator,
        { type: 'client', className: 'client panel-button' },
        { type: 'media/panel-indicator', className: 'media panel-button', hexpand: true, halign: 'end' },
    ],
    center: [
        { type: 'dashboard/panel-button' },
    ],
    end: [
        { type: 'notifications/panel-indicator', direction: 'right', className: 'notifications panel-button', hexpand: true },
        { type: 'box', hexpand: true },
        { type: 'recorder/indicator-button', className: 'recorder panel-button' },
        { type: 'colorpicker', className: 'colorpicker panel-button' },
        separator,
        { type: 'quicksettings/panel-button' },
        separator,
        { type: 'powermenu/panel-button' },
    ],
});

/* exported windows */
var windows = [
    ...ags.Service.Hyprland.HyprctlGet('monitors').map(({ id }) => ([
        dock(id),
        notifications(id),
        desktop(id),
        ...corners(id),
        panel(id),
    ])).flat(),
    dashboard,
    quicksettings,
];
