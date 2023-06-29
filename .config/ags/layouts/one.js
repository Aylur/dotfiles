const Shared = imports.layouts.shared;

// static
const dock = Shared.dock
const notifications = monitor => Shared.notifications(monitor, 'slide_left', ['top', 'right']);
const desktop = monitor => Shared.desktop(monitor, 'topbar');

// popups
const datemenu = {
    name: 'datemenu',
    popup: true,
    anchor: ['top', 'right', 'bottom', 'left'],
    child: {
        type: 'layout',
        layout: 'topleft',
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
        layout: 'top',
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
        separator,
        { type: 'client' },
    ],
};

const center = {
    type: 'box',
    className: 'center',
    children: [
        { type: 'media/panel-button' },
    ],
};

const right = {
    type: 'box',
    className: 'right',
    hexpand: true,
    halign: 'end',
    children: [
        { type: 'colorpicker' },
        separator,
        { type: 'notification-center/panel-button' },
        separator,
        { type: 'powermenu/panel-button' },
    ],
};

const bar = (monitor) => ({
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

// export
var windows = [
    ...ags.Service.Hyprland.HyprctlGet('monitors').map(({ id }) => ([
        dock(id),
        notifications(id),
        desktop(id),
        bar(id),
    ])).flat(),
    datemenu,
    media,
    quicksettings,
];
