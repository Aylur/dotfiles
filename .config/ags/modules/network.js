const { Network } = ags.Service;
const { Label, Icon, Box, Stack, Button } = ags.Widget;

export const SSIDLabel = props => Label({
    ...props,
    connections: [[Network, label => label.label = Network.wifi?.ssid || 'Not Connected']],
});

export const WifiStrengthLabel = props => Label({
    ...props,
    connections: [[Network, label => label.label = `${Network.wifi?.strength || -1}`]],
});

export const WiredIndicator = ({
    connecting = Icon('network-wired-acquiring-symbolic'),
    disconnected = Icon('network-wired-no-route-symbolic'),
    disabled = Icon('network-wired-disconnected-symbolic'),
    connected = Icon('network-wired-symbolic'),
    unknown = Icon('content-loading-symbolic'),
} = {}) => Stack({
    items: [
        ['unknown', unknown],
        ['disconnected', disconnected],
        ['disabled', disabled],
        ['connected', connected],
        ['connecting', connecting],
    ],
    connections: [[Network, stack => {
        if (!Network.wired)
            return;

        const { internet } = Network.wired;
        if (internet === 'connected' || internet === 'connecting')
            return stack.shown = internet;

        if (Network.connectivity !== 'full')
            return stack.shown = 'disconnected';

        return stack.shown = 'disabled';
    }]],
});

export const WifiIndicator = ({
    disabled = Icon('network-wireless-disabled-symbolic'),
    disconnected = Icon('network-wireless-offline-symbolic'),
    connecting = Icon('network-wireless-acquiring-symbolic'),
    connected = [
        ['80', Icon('network-wireless-signal-excellent-symbolic')],
        ['60', Icon('network-wireless-signal-good-symbolic')],
        ['40', Icon('network-wireless-signal-ok-symbolic')],
        ['20', Icon('network-wireless-signal-weak-symbolic')],
        ['0', Icon('network-wireless-signal-none-symbolic')],
    ],
} = {}) => Stack({
    items: [
        ['disabled', disabled],
        ['disconnected', disconnected],
        ['connecting', connecting],
        ...connected,
    ],
    connections: [[Network, stack => {
        if (!Network.wifi)
            return;

        const { internet, enabled, strength } = Network.wifi;
        if (internet === 'connected') {
            for (const threshold of [80, 60, 40, 20, 0]) {
                if (strength >= threshold)
                    return stack.shown = `${threshold}`;
            }
        }

        if (internet === 'connecting')
            return stack.shown = 'connecting';

        if (enabled)
            return stack.shown = 'disconnected';

        return stack.shown = 'disabled';
    }]],
});

export const Indicator = ({
    wifi = WifiIndicator(),
    wired = WifiIndicator(),
} = {}) => Stack({
    items: [
        ['wired', wired],
        ['wifi', wifi],
    ],
    connections: [[Network, stack => {
        stack.shown = Network.primary || 'wifi';
    }]],
});

export const WifiToggle = props => Button({
    ...props,
    onClicked: Network.toggleWifi,
    connections: [[Network, button => {
        button.toggleClassName('on', Network.wifi?.enabled);
    }]],
});

const icons = [
    { value: 80, icon: 'network-wireless-signal-excellent-symbolic' },
    { value: 60, icon: 'network-wireless-signal-good-symbolic' },
    { value: 40, icon: 'network-wireless-signal-ok-symbolic' },
    { value: 20, icon: 'network-wireless-signal-weak-symbolic' },
    { value: 0, icon: 'network-wireless-signal-none-symbolic' },
];

export const WifiSelection = props => Box({
    ...props,
    vertical: true,
    connections: [[Network, box => box.children =
        Network.wifi?.accessPoints.map(ap => Button({
            onClicked: `nmcli device wifi connect ${ap.bssid}`,
            child: Box({
                children: [
                    Icon(icons.find(({ value }) => value <= ap.strength).icon),
                    Label(ap.ssid),
                    ap.active && Icon({
                        icon: 'object-select-symbolic',
                        hexpand: true,
                        halign: 'end',
                    }),
                ],
            }),
        })),
    ]],
});
