const Shared = imports.layouts.shared;

// static windows
const notifications = monitor => Shared.notifications(monitor, 'slide_down', ['top']);
const desktop = Shared.desktop;
const corners = Shared.corners;

// popups
const dashboard = {
    name: 'dashboard',
    popup: true,
    focusable: true,
    anchor: ['top', 'right'],
    child: {
        type: 'layout',
        layout: 'topright',
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
        { type: 'media/panel-indicator', className: 'media panel-button', direction: 'right' },
    ],
};

const right = {
    type: 'box',
    className: 'right',
    hexpand: true,
    halign: 'end',
    children: [
        { type: 'notifications/panel-indicator', className: 'notifications panel-button' },
        { type: 'recorder/indicator-button', className: 'recorder panel-button' },
        { type: 'colorpicker', className: 'colorpicker panel-button' },
        separator,
        { type: 'quicksettings/panel-button' },
        separator,
        { type: 'dashboard/panel-button' },
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
        type: 'box',
        className: 'panel',
        children: [
            left,
            right,
        ],
    },
});

const dock = monitor => ({
    name: `dock${monitor}`,
    monitor,
    anchor: ['top', 'left', 'bottom'],
    exclusive: true,
    child: {
        type: 'box',
        orientation: 'vertical',
        className: 'dock',
        children: [
            {
                vexpand: true,
                type: 'dock',
                iconSize: 38,
                orientation: 'vertical',
                launcher: null,
            },
            {
                type: 'button',
                tooltip: 'Applications',
                onClick: () => ags.App.toggleWindow('applauncher'),
                className: 'launcher',
                child: {
                    type: 'box',
                    children: [{
                        type: 'icon',
                        icon: 'view-app-grid-symbolic',
                        size: 38,
                    }],
                },
            },
        ],
    },
});

/* exported windows */
var windows = [
    ...ags.Service.Hyprland.HyprctlGet('monitors').map(({ id }) => ([
        bar(id),
        dock(id),
        notifications(id),
        desktop(id),
        ...corners(id),
    ])).flat(),
    dashboard,
    quicksettings,
];
