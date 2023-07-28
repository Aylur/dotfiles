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
const { launcher } = imports.layouts.shared;
const separator = { type: 'separator', valign: 'center' };

const left = {
    type: 'box',
    className: 'left',
    children: [
        launcher(),
        separator,
        { type: 'workspaces', className: 'workspaces' },
        separator,
        { type: 'client', className: 'client panel-button' },
        { type: 'media/panel-indicator', className: 'media panel-button', hexpand: true, halign: 'end' },
    ],
};

const center = {
    type: 'box',
    className: 'center',
    children: [
        { type: 'dashboard/panel-button' },
    ],
};

const right = {
    type: 'box',
    className: 'right',
    children: [
        { type: 'notifications/panel-indicator', direction: 'right', className: 'notifications panel-button' },
        { type: 'box', hexpand: true },
        { type: 'recorder/indicator-button', className: 'recorder panel-button' },
        { type: 'colorpicker', className: 'colorpicker panel-button' },
        separator,
        { type: 'quicksettings/panel-button' },
        separator,
        { type: 'powermenu/panel-button' },
    ],
};

const bar = monitor => ({
    name: `bar${monitor}`,
    monitor,
    anchor: ['top', 'left', 'right'],
    exclusive: true,
    child: {
        type: 'centerbox',
        className: 'panel',
        children: [
            left,
            center,
            right,
        ],
    },
});

/* exported windows */
var windows = [
    ...ags.Service.Hyprland.HyprctlGet('monitors').map(({ id }) => ([
        dock(id),
        notifications(id),
        desktop(id),
        ...corners(id),
        bar(id),
    ])).flat(),
    dashboard,
    quicksettings,
];
