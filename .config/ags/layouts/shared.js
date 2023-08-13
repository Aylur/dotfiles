/* exported notifications, desktop, corners, indicator, dock, separator,
            launcher bar applauncher, overview, powermenu, verification*/

// static
var notifications = (monitor, transition, anchor) => ({
    monitor,
    name: `notifications${monitor}`,
    anchor,
    child: { type: 'notifications/popup-list', transition },
});

var desktop = monitor => ({
    monitor,
    name: `desktop${monitor}`,
    className: 'desktop',
    anchor: ['top', 'bottom', 'left', 'right'],
    child: { type: 'desktop' },
    layer: 'background',
});

var corners = (monitor, places = ['topleft', 'topright', 'bottomleft', 'bottomright']) => places.map(place => ({
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
    child: { type: 'on-screen-indicator' },
});

var dock = monitor => ({
    monitor,
    name: `dock${monitor}`,
    anchor: ['bottom'],
    child: { type: 'floating-dock' },
});

// bar
var launcher = (size = ags.Utils.getConfig()?.baseIconSize || 16) => ({
    type: 'button',
    className: 'launcher panel-button',
    connections: [[ags.App, (btn, win, visible) => {
        btn.toggleClassName('active', win === 'overview' && visible);
    }]],
    onClick: () => ags.App.toggleWindow('overview'),
    child: { type: 'distro-icon', size },
});

var bar = ({ anchor, start, center, end }) => monitor => ({
    name: `bar${monitor}`,
    monitor,
    anchor,
    exclusive: true,
    child: {
        type: 'centerbox',
        className: 'panel',
        children: [
            { className: 'start', type: 'box', children: start },
            { className: 'center', type: 'box', children: center },
            { className: 'end', type: 'box', children: end },
        ],
    },
});

//popups
const popup = (name, child) => ({
    name,
    popup: true,
    focusable: true,
    layer: 'overlay',
    child: {
        type: 'layout',
        layout: 'center',
        window: name,
        child,
    },
});

var applauncher = popup('applauncher', {
    type: 'applauncher',
    className: 'applauncher',
});

var overview = popup('overview', {
    type: 'overview',
});

var powermenu = popup('powermenu', {
    type: 'powermenu/popup-content',
});

var verification = popup('verification', {
    type: 'powermenu/verification',
});
