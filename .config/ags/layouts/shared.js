//static
var notifications = (monitor, transition, anchor) => ({
    monitor,
    name: `notifications${monitor}`,
    anchor,
    child: { type: 'notifications/popups', transition },
});

var desktop = (monitor, className) => ({
    monitor,
    name: `desktop${monitor}`,
    anchor: ['top', 'bottom', 'left', 'right'],
    child: { type: 'desktop', className },
    layer: 'background',
});

var indicator = monitor => ({
    monitor,
    name: `indicator${monitor}`,
    className: 'indicator',
    anchor: ['right'],
    child: { type: 'on-screen-indicator/vertical' },
});

var dock = monitor => ({
    monitor,
    name: `dock${monitor}`,
    anchor: ['bottom'],
    child: { type: 'floating-dock' },
});

// bar
var separator = {
    type: 'box',
    className: 'separator',
    valign: 'center',
}

var launcher = {
    type: 'button',
    className: 'launcher',
    onClick: () => ags.App.toggleWindow('overview'),
    child: '',
}

//popup
var applauncher = {
    name: 'applauncher',
    popup: true,
    focusable: true,
    anchor: ['top', 'bottom', 'left', 'right'],
    child: {
        type: 'layout',
        layout: 'center',
        window: 'applauncher',
        child: {
            type: 'apps/popup-content',
            window: 'applauncher',
        },
    },
};

var overview = {
    name: 'overview',
    anchor: ['top', 'bottom', 'left', 'right'],
    popup: true,
    focusable: true,
    child: {
        type: 'layout',
        layout: 'center',
        window: 'overview',
        child: { type: 'overview' },
    },
};

var powermenu = {
    name: 'powermenu',
    popup: true,
    focusable: true,
    child: {
        type: 'layout',
        layout: 'center',
        window: 'powermenu',
        child: { type: 'powermenu/popup-content' },
    },
}

var verification = {
    name: 'verification',
    popup: true,
    child: {
        type: 'layout',
        layout: 'center',
        window: 'verification',
        child: { type: 'powermenu/verification' },
    },
};
