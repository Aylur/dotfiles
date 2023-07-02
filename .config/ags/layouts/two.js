const Shared = imports.layouts.shared;

// static windows
const dock = Shared.dock;
const notifications = monitor => Shared.notifications(monitor, 'slide_down', ['top']);
const desktop = monitor => Shared.desktop(monitor, 'topbar');

// popups
const dashboard = {
    name: 'dashboard',
    popup: true,
    anchor: ['top', 'right', 'bottom', 'left'],
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
    anchor: ['top', 'right', 'bottom', 'left'],
    child: {
        type: 'layout',
        layout: 'topright',
        window: 'quicksettings',
        child: { type: 'quicksettings/popup-content' },
    },
};

// bar
const { separator, launcher } = imports.layouts.shared;

const left = {
    type: 'box',
    className: 'left',
    children: [
        launcher,
        separator,
        { type: 'workspaces' },
        separator,
        { type: 'client' },
        { type: 'dashboard/media-indicator', hexpand: true, halign: 'end' },
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
        { type: 'dashboard/notifications-indicator', hexpand: true, halign: 'start' },
        { type: 'colorpicker' },
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
        bar(id),
    ])).flat(),
    dashboard,
    quicksettings,
];
