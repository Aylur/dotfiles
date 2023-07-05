const Shared = imports.layouts.shared;

// static windows
const notifications = monitor => Shared.notifications(monitor, 'slide_left', ['bottom', 'right']);
const desktop = Shared.desktop;
const corners = Shared.corners;

// popups
const datemenu = {
    name: 'datemenu',
    popup: true,
    anchor: ['top', 'right', 'bottom', 'left'],
    child: {
        type: 'layout',
        layout: 'bottomleft',
        window: 'datemenu',
        child: { type: 'datemenu/popup-content' },
    },
};

const media = {
    name: 'media',
    popup: true,
    anchor: ['top', 'bottom', 'left', 'right'],
    child: {
        type: 'layout',
        layout: 'bottomright',
        window: 'media',
        child: { type: 'media/popup-content' },
    },
};

const quicksettings = {
    name: 'quicksettings',
    popup: true,
    anchor: ['top', 'right', 'bottom', 'left'],
    child: {
        type: 'layout',
        layout: 'right',
        window: 'quicksettings',
        child: { type: 'quicksettings/notification-center' },
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
        { type: 'datemenu/panel-button' },
        separator,
        { type: 'workspaces' },
    ],
};

const center = {
    type: 'box',
    className: 'center',
    children: [
        { type: 'dock', iconSize: 32 },
    ],
};

const right = {
    type: 'box',
    className: 'right',
    hexpand: true,
    halign: 'end',
    children: [
        {
            type: 'media/indicator',
            className: 'media',
            onClick: () => ags.App.toggleWindow('media'),
        },
        {
            type: 'mpris/box',
            player: imports.widgets.media.prefer('spotify'),
            valign: 'center',
            className: 'separator',
        },
        { type: 'recorder/indicator-button' },
        { type: 'colorpicker' },
        separator,
        { type: 'notification-center/panel-button' },
        separator,
        { type: 'powermenu/panel-button' },
    ],
};

const bar = monitor => ({
    name: `bar${monitor}`,
    monitor,
    anchor: ['bottom', 'left', 'right'],
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
        notifications(id),
        desktop(id),
        bar(id),
        ...corners(id),
    ])).flat(),
    datemenu,
    media,
    quicksettings,
];
