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

var dashboard = {
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

var overview = {
    name: 'overview',
    anchor: ['top', 'bottom', 'left', 'right'],
    popup: true,
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

var quicksettings = {
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
