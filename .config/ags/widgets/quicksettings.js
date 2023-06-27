const { Widget } = ags;
const { Network, Bluetooth, Battery, Audio } = ags.Service;
const { runCmd, execAsync, exec, applyCss, CONFIG_DIR } = ags.Utils;

const slider = ({ icon, slider, percent, arrowCmd }) => ({
    type: 'box',
    className: 'slider-box',
    children: [
        { type: icon, className: 'icon' },
        { type: slider, className: 'slider', hexpand: true },
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

const toggle = (toggle, indicator) => ({
    type: toggle,
    hexpand: true,
    child: {
        type: indicator,
        halign: 'center',
    },
});

const quicksettings = {
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
                toggle('notifications/dnd-toggle', 'notifications/dnd-indicator'),
                toggle('audio/microphone-mute-toggle', 'audio/microphone-mute-indicator'),
                toggle('bluetooth/toggle', 'bluetooth/indicator'),
                toggle('network/wifi-toggle', 'network/wifi-indicator'),
                toggle('style/toggle', 'style/indicator'),
            ],
        },
    ],
};

Widget.widgets['quicksettings/popup-content'] = () => Widget({
    type: 'box',
    orientation: 'vertical',
    className: 'quicksettings',
    children: [
        {
            type: 'box',
            vexpand: true,
            children: [{ type: 'notifications/quicksettings' }],
        },
        {
            type: 'audio/app-mixer',
            className: 'mixer',
            connections: [[Audio, mixer => {
                mixer.visible = Audio.apps.size > 0;
            }]]
        },
        quicksettings,
    ]
});

const battery = {
    type: 'box',
    className: 'indicator battery',
    children: [
        { type: 'battery/level-label' },
        { type: 'battery/indicator' },
    ],
    connections: [[Battery, box => {
        box.toggleClassName(Battery.state.charging, 'charging');
        box.toggleClassName(Battery.state.charged, 'charged');
        box.toggleClassName(Battery.state.percent < 30, 'low');
        box.get_children()[0].visible = Battery.state.percent < 100;
    }]]
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
                            label.label = Bluetooth.state.connectedDevices[0]?.alias || 'Nothing Connected';
                        }]]
                    },
                },
                {
                    type: 'icon',
                    className: 'device',
                    connections: [[Bluetooth, icon => {
                        icon.icon_name = Bluetooth.state.connectedDevices[0]?.iconName+'-symbolic';
                        icon.visible = Bluetooth.state.connectedDevices.length > 0;
                    }]]
                },
                { type: 'bluetooth/indicator' },
            ],
        },
    }],
    connections: [[Bluetooth, box => box.visible = Bluetooth.state.state === 'enabled']],
}

const { Indicator } = imports.widgets.popupindicator;
Widget.widgets['quicksettings/panel-button'] = () => Widget({
    type: 'eventbox',
    className: 'quicksettings',
    onClick: () => ags.App.toggleWindow('quicksettings'),
    onScrollUp: () => {
        Audio.speaker.volume += 2;
        Indicator.speaker();
    },
    onScrollDown: () => {
        Audio.speaker.volume -= 2;
        Indicator.speaker();
    },
    child: {
        type: 'box',
        children: [
            { className: 'indicator notifications', type: 'notifications/indicator' },
            { className: 'indicator', type: 'audio/microphone-mute-indicator', unmuted: null },
            bluetooth,
            network,
            { className: 'indicator', type: 'audio/speaker-indicator' },
            battery,
        ],
    },
});
