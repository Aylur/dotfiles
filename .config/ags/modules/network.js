const { Widget } = ags;
const { Network } = ags.Service;

const icons = [
    { value: 80, widget: { type: 'icon', icon: 'network-wireless-signal-excellent-symbolic' } },
    { value: 60, widget: { type: 'icon', icon: 'network-wireless-signal-good-symbolic' } },
    { value: 40, widget: { type: 'icon', icon: 'network-wireless-signal-ok-symbolic' } },
    { value: 20, widget: { type: 'icon', icon: 'network-wireless-signal-weak-symbolic' } },
    { value: 0, widget: { type: 'icon', icon: 'network-wireless-signal-none-symbolic' } },
];

Widget.widgets['network/ssid-label'] = props => Widget({
    ...props,
    type: 'label',
    connections: [[Network, label => label.label = Network.wifi?.ssid || 'Not Connected']],
});

Widget.widgets['network/wifi-strength-label'] = props => Widget({
    ...props,
    type: 'label',
    connections: [[Network, label => label.label = `${Network.wifi?.strength || -1}`]],
});

Widget.widgets['network/wired-indicator'] = ({
    connecting = { type: 'icon', icon: 'network-wired-acquiring-symbolic' },
    disconnected = { type: 'icon', icon: 'network-wired-no-route-symbolic' },
    disabled = { type: 'icon', icon: 'network-wired-disconnected-symbolic' },
    connected = { type: 'icon', icon: 'network-wired-symbolic' },
    unknown = { type: 'icon', icon: 'content-loading-symbolic' },
}) => Widget({
    type: 'dynamic',
    items: [
        { value: 'unknown', widget: unknown },
        { value: 'disconnected', widget: disconnected },
        { value: 'disabled', widget: disabled },
        { value: 'connected', widget: connected },
        { value: 'connecting', widget: connecting },
    ],
    connections: [[Network, dynamic => dynamic.update(value => {
        if (!Network.wired)
            return;

        const { internet } = Network.wired;
        if (internet === 'connected' || internet === 'connecting')
            return value === internet;

        if (Network.connectivity !== 'full')
            return value === 'disconnected';

        return value === 'disabled';
    })]],
});

Widget.widgets['network/wifi-indicator'] = ({
    disabled = { type: 'icon', icon: 'network-wireless-disabled-symbolic' },
    disconnected = { type: 'icon', icon: 'network-wireless-offline-symbolic' },
    connecting = { type: 'icon', icon: 'network-wireless-acquiring-symbolic' },
    connected = icons,
}) => Widget({
    type: 'dynamic',
    items: [
        { value: 'disabled', widget: disabled },
        { value: 'disconnected', widget: disconnected },
        { value: 'connecting', widget: connecting },
        ...connected,
    ],
    connections: [[Network, dynamic => dynamic.update(value => {
        if (!Network.wifi)
            return;

        const { internet, enabled, strength } = Network.wifi;
        if (internet === 'connected')
            return value <= strength;

        if (internet === 'connecting')
            return value === 'connecting';

        if (enabled)
            return value === 'disconnected';

        return value === 'disabled';
    })]],
});

Widget.widgets['network/indicator'] = ({
    wifi = { type: 'network/wifi-indicator' },
    wired = { type: 'network/wired-indicator' },
}) => Widget({
    type: 'dynamic',
    items: [
        { value: 'wired', widget: wired },
        { value: 'wifi', widget: wifi },
    ],
    connections: [[Network, dynamic => {
        const primary = Network.primary || 'wifi';
        dynamic.update(value => value === primary);
    }]],
});

Widget.widgets['network/wifi-toggle'] = props => Widget({
    ...props,
    type: 'button',
    onClick: Network.toggleWifi,
    connections: [[Network, button => {
        button.toggleClassName('on', Network.wifi?.enabled);
    }]],
});

Widget.widgets['network/wifi-selection'] = props => Widget({
    ...props,
    type: 'box',
    orientation: 'vertical',
    connections: [[Network, box => {
        box.get_children().forEach(ch => ch.destroy());
        Network.wifi?.accessPoints.forEach(ap => {
            box.add(Widget({
                type: 'button',
                child: {
                    type: 'box',
                    children: [
                        icons.find(({ value }) => value <= ap.strength).widget,
                        {
                            type: 'label',
                            label: ap.ssid,
                        },
                        ap.active ? {
                            type: 'icon',
                            icon: 'object-select-symbolic',
                            hexpand: true,
                            halign: 'end',
                        } : null,
                    ].filter(i => i),
                },
                onClick: `nmcli device wifi connect ${ap.bssid}`,
            }));
        });
        box.show_all();
    }]],
});
