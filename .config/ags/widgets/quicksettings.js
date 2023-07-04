const { Widget } = ags;
const { Bluetooth, Battery, Audio } = ags.Service;
const { runCmd, execAsync } = ags.Utils;

const slider = ({ icon, slider, percent, arrowCmd }) => ({
    type: 'box',
    className: 'slider-box',
    children: [
        { type: icon, className: 'icon' },
        { type: slider, hexpand: true },
        {
            type: 'box',
            className: 'percent',
            children: [
                { type: percent, hexpand: true, halign: 'end' },
                '%',
            ],
        },
        {
            type: 'button',
            onClick: () => runCmd(arrowCmd),
            child: {
                type: 'icon',
                icon: 'pan-end-symbolic',
            },
        },
    ],
});

const smalltoggle = (toggle, indicator) => ({
    type: toggle,
    hexpand: true,
    child: {
        type: indicator,
        halign: 'center',
    },
});

const { sysAction } = imports.widgets.powermenu;
const sysBtn = (icon, action, className = '') => ({
    type: 'button',
    className,
    onClick: () => sysAction(action),
    tooltip: action,
    child: {
        type: 'icon',
        icon,
    },
});

Widget.widgets['quicksettings/popup-content'] = () => Widget({
    type: 'box',
    className: 'quicksettings',
    orientation: 'vertical',
    children: [
        {
            type: 'box',
            className: 'header',
            children: [
                {
                    type: 'box',
                    className: 'avatar',
                    style: `
                        background-image: url('${imports.settings.avatar}');
                        background-size: cover;
                    `,
                    children: [{
                        type: 'box',
                        hexpand: true,
                        vexpand: true,
                        className: 'shader',
                    }],
                },
                {
                    type: 'label',
                    className: 'user',
                    label: imports.settings.atUser,
                    halign: 'start',
                    valign: 'center',
                    hexpand: true,
                },
                {
                    type: 'box',
                    valign: 'center',
                    className: 'system',
                    children: [
                        {
                            type: 'button',
                            className: 'settings',
                            onClick: () => execAsync(imports.settings.openSettings),
                            tooltip: 'Settings',
                            child: {
                                type: 'icon',
                                icon: 'org.gnome.Settings-symbolic',
                            },
                        },
                        sysBtn('system-log-out-symbolic', 'Log Out'),
                        sysBtn('system-shutdown-symbolic', 'Shutdown', 'shutdown'),
                    ],
                },
            ],
        },
        {
            type: 'audio/app-mixer',
            className: 'mixer',
            connections: [[Audio, mixer => {
                mixer.visible = Audio.apps.size > 0;
            }]],
        },
        {
            type: 'box',
            orientation: 'vertical',
            className: 'sliders',
            children: [
                slider({
                    icon: 'audio/speaker-indicator',
                    slider: 'audio/speaker-slider',
                    percent: 'audio/speaker-label',
                    arrowCmd: 'pavucontrol',
                }),
                slider({
                    icon: 'brightness/icon',
                    slider: 'brightness/slider',
                    percent: 'brightness/percent',
                    arrowCmd: 'wl-gammactl',
                }),
            ],
        },
        {
            type: 'box',
            className: 'toggles',
            children: [
                smalltoggle('notifications/dnd-toggle', 'notifications/dnd-indicator'),
                smalltoggle('audio/microphone-mute-toggle', 'audio/microphone-mute-indicator'),
                smalltoggle('bluetooth/toggle', 'bluetooth/indicator'),
                smalltoggle('network/wifi-toggle', 'network/wifi-indicator'),
                smalltoggle('style/toggle', 'style/indicator'),
            ],
        },
    ],
});

Widget.widgets['quicksettings/notification-center'] = () => Widget({
    type: 'box',
    orientation: 'vertical',
    className: 'notification-center',
    children: [
        {
            type: 'box',
            vexpand: true,
            children: [{ type: 'notifications/popup-content' }],
        },
        {
            type: 'audio/app-mixer',
            className: 'mixer',
            connections: [[Audio, mixer => {
                mixer.visible = Audio.apps.size > 0;
            }]],
        },
        {
            type: 'box',
            orientation: 'vertical',
            className: 'settings',
            valign: 'end',
            children: [
                slider({
                    icon: 'audio/speaker-indicator',
                    slider: 'audio/speaker-slider',
                    percent: 'audio/speaker-label',
                    arrowCmd: 'pavucontrol',
                }),
                slider({
                    icon: 'brightness/icon',
                    slider: 'brightness/slider',
                    percent: 'brightness/percent',
                    arrowCmd: 'wl-gammactl',
                }),
                {
                    type: 'box',
                    className: 'toggles',
                    children: [
                        smalltoggle('notifications/dnd-toggle', 'notifications/dnd-indicator'),
                        smalltoggle('audio/microphone-mute-toggle', 'audio/microphone-mute-indicator'),
                        smalltoggle('bluetooth/toggle', 'bluetooth/indicator'),
                        smalltoggle('network/wifi-toggle', 'network/wifi-indicator'),
                        smalltoggle('style/toggle', 'style/indicator'),
                    ],
                },
            ],
        },
    ],
});

const battery = {
    type: 'box',
    className: 'indicator battery',
    children: [
        { type: 'battery/level-label' },
        { type: 'battery/indicator' },
    ],
    connections: [[Battery, box => {
        box.toggleClassName('charging', Battery.charging);
        box.toggleClassName('charged', Battery.charged);
        box.toggleClassName('low', Battery.percent < 30);
        box.get_children()[0].visible = Battery.percent < 100;
    }]],
};

const network = {
    type: 'box',
    className: 'indicator network',
    children: [{
        type: 'eventbox',
        onHover: eventbox => eventbox.get_child().get_children()[0].reveal_child = true,
        onHoverLost: eventbox => eventbox.get_child().get_children()[0].reveal_child = false,
        child: {
            type: 'box',
            children: [
                {
                    type: 'revealer',
                    transition: 'slide_left',
                    child: { type: 'network/ssid-label' },
                },
                { type: 'network/indicator' },
            ],
        },
    }],
};

const bluetooth = {
    type: 'box',
    className: 'indicator bluetooth',
    children: [{
        type: 'eventbox',
        onHover: eventbox => eventbox.get_child().get_children()[0].reveal_child = true,
        onHoverLost: eventbox => eventbox.get_child().get_children()[0].reveal_child = false,
        child: {
            type: 'box',
            children: [
                {
                    type: 'revealer',
                    transition: 'slide_left',
                    child: {
                        type: 'label',
                        connections: [[Bluetooth, label => {
                            label.label = Bluetooth.connectedDevices[0]?.alias || 'Not Connected';
                        }]],
                    },
                },
                {
                    type: 'icon',
                    className: 'device',
                    connections: [[Bluetooth, icon => {
                        icon.icon_name = Bluetooth.connectedDevices[0]?.iconName+'-symbolic';
                        icon.visible = Bluetooth.connectedDevices.length > 0;
                    }]],
                },
                { type: 'bluetooth/indicator' },
            ],
        },
    }],
    connections: [[Bluetooth, box => box.visible = Bluetooth.enabled]],
};

const { Indicator } = imports.widgets.popupindicator;
const panelButton = dnd => Widget({
    type: 'eventbox',
    className: 'quicksettings',
    onClick: () => ags.App.toggleWindow('quicksettings'),
    onScrollUp: () => {
        Audio.speaker.volume += 0.02;
        Indicator.speaker();
    },
    onScrollDown: () => {
        Audio.speaker.volume -= 0.02;
        Indicator.speaker();
    },
    child: {
        type: 'box',
        children: [
            dnd ? { className: 'indicator notifications', type: 'notifications/indicator' } : null,
            { className: 'indicator', type: 'audio/microphone-mute-indicator', unmuted: null },
            bluetooth,
            network,
            { className: 'indicator', type: 'audio/speaker-indicator' },
            battery,
        ].filter(i => i),
    },
});

Widget.widgets['quicksettings/panel-button'] = () => panelButton(false);
Widget.widgets['notification-center/panel-button'] = () => panelButton(true);
