const { Network } = ags.Service;
const { Label, Icon, Box, Stack, Button } = ags.Widget;

export const SSIDLabel = props => Label({
    ...props,
    connections: [[Network, label => {
        label.label = Network.wifi?.ssid || 'Not Connected';
    }]],
});

export const WifiStrengthLabel = props => Label({
    ...props,
    connections: [[Network, label => {
        label.label = `${Network.wifi?.strength || -1}`;
    }]],
});

export const WiredIndicator = props => Icon({
    ...props,
    connections: [[Network, icon => {
        icon.icon = Network.wired?.iconName;
    }]],
});

export const WifiIndicator = props => Icon({
    ...props,
    connections: [[Network, icon => {
        icon.icon = Network.wifi?.iconName;
    }]],
});

export const Indicator = ({
    wifi = WifiIndicator(),
    wired = WiredIndicator(),
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
