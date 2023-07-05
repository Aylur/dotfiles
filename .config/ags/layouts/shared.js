/* exported notifications, desktop, corners, indicator, dock, separator,
            launcher applauncher, overview, powermenu, verification*/

// static
var notifications = (monitor, transition, anchor) => ({
    monitor,
    name: `notifications${monitor}`,
    anchor,
    child: { type: 'notifications/popups', transition },
});

var desktop = monitor => ({
    monitor,
    name: `desktop${monitor}`,
    anchor: ['top', 'bottom', 'left', 'right'],
    child: { type: 'desktop' },
    layer: 'background',
});

var corners = monitor => ['topleft', 'topright', 'bottomleft', 'bottomright'].map(place => ({
    monitor,
    name: `corner${monitor}${place}`,
    className: 'corners',
    anchor: [place.includes('top') ? 'top' : 'bottom', place.includes('right') ? 'right' : 'left'],
    child: { type: 'corner', place },
}));

var indicator = monitor => ({
    monitor,
    name: `indicator${monitor}`,
    className: 'indicator',
    layer: 'overlay',
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
};

var launcher = {
    type: 'button',
    className: 'launcher',
    onClick: () => ags.App.toggleWindow('overview'),
    child: '',
};

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
            type: 'applauncher/popup-content',
            windowName: 'applauncher',
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
};

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
