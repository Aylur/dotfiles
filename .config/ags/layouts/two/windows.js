// static windows
var dock = monitor => ({
    monitor,
    name: `dock${monitor}`,
    anchor: ['bottom'],
    child: { type: 'dock' },
});

var notifications = monitor => ({
    monitor,
    name: `notifications${monitor}`,
    anchor: ['top'],
    child: { type: 'notifications/popups' },
});

var desktop = monitor => ({
    monitor,
    name: `desktop${monitor}`,
    anchor: ['top', 'bottom', 'left', 'right'],
    child: { type: 'desktop' },
    layer: 'background',
});

var indicator = (monitor) => ({
    monitor,
    name: `indicator${monitor}`,
    className: 'indicator',
    anchor: ['right'],
    child: { type: 'on-screen-indicator/vertical' },
})

// bar
const separator = {
    type: 'box',
    className: 'separator',
    valign: 'center',
}

const launcher = {
    type: 'button',
    className: 'launcher',
    onClick: () => ags.App.toggleWindow('overview'),
    child: '',
}

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

var bar = (monitor) => ({
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
