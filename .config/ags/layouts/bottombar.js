const Shared = imports.layouts.shared;

// static windows
const notifications = monitor => Shared.notifications(monitor, 'slide_left', ['bottom', 'right']);
const desktop = Shared.desktop;
const corners = Shared.corners;

// popups
const dashboard = {
    name: 'dashboard',
    popup: true,
    focusable: true,
    anchor: ['right', 'bottom'],
    child: {
        type: 'layout',
        layout: 'bottomright',
        window: 'dashboard',
        child: { type: 'dashboard/popup-content' },
    },
};

const quicksettings = {
    name: 'quicksettings',
    popup: true,
    focusable: true,
    anchor: ['right', 'bottom'],
    child: {
        type: 'layout',
        layout: 'bottomright',
        window: 'quicksettings',
        child: { type: 'quicksettings/popup-content' },
    },
};

// bar
const { launcher, bar } = imports.layouts.shared;
const separator = { type: 'separator', valign: 'center' };

const panel = bar({
    anchor: ['bottom', 'left', 'right'],
    start: [
        launcher(24),
        separator,
        { type: 'workspaces', className: 'workspaces panel-button' },
    ],
    center: [
        {
            type: 'box',
            className: 'panel-button dock-container',
            children: [
                { className: 'dock', type: 'dock', iconSize: 38 },
            ],
        },
    ],
    end: [
        { type: 'box', hexpand: true },
        { type: 'recorder/indicator-button', className: 'recorder panel-button' },
        { type: 'colorpicker', className: 'colorpicker panel-button' },
        separator,
        { type: 'dashboard/panel-button', format: '%H:%M:%S%n%A %d.' },
        separator,
        { type: 'quicksettings/panel-button' },
        separator,
        { type: 'powermenu/panel-button' },
    ],
});

/* exported windows */
var windows = [
    ...ags.Service.Hyprland.HyprctlGet('monitors').map(({ id }) => ([
        notifications(id),
        desktop(id),
        panel(id),
        ...corners(id),
    ])).flat(),
    dashboard,
    quicksettings,
];
