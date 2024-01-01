import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Network from 'resource:///com/github/Aylur/ags/service/network.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import icons from '../../icons.js';
import { Menu, ArrowToggleButton } from '../ToggleButton.js';
import Applications from 'resource:///com/github/Aylur/ags/service/applications.js';

export const NetworkToggle = () => ArrowToggleButton({
    name: 'network',
    icon: Widget.Icon({
        icon: Network.wifi.bind('icon_name'),
    }),
    label: Widget.Label({
        truncate: 'end',
        label: Network.wifi.bind('ssid').transform(ssid => ssid || 'Not Connected'),
    }),
    connection: [Network, () => Network.wifi.enabled],
    deactivate: () => Network.wifi.enabled = false,
    activate: () => {
        Network.wifi.enabled = true;
        Network.wifi.scan();
    },
});

export const WifiSelection = () => Menu({
    name: 'network',
    icon: Widget.Icon({
        icon: Network.wifi.bind('icon_name'),
    }),
    title: Widget.Label('Wifi Selection'),
    content: [
        Widget.Box({
            vertical: true,
            setup: self => self.hook(Network, () => self.children =
                Network.wifi?.access_points.map(ap => Widget.Button({
                    on_clicked: () => Utils.execAsync(`nmcli device wifi connect ${ap.bssid}`),
                    child: Widget.Box({
                        children: [
                            Widget.Icon(ap.iconName),
                            Widget.Label(ap.ssid || ''),
                            ap.active && Widget.Icon({
                                icon: icons.ui.tick,
                                hexpand: true,
                                hpack: 'end',
                            }),
                        ],
                    }),
                })),
            ),
        }),
        Widget.Separator(),
        Widget.Button({
            on_clicked: () => Applications.query('gnome-control-center')?.[0].launch(),
            child: Widget.Box({
                children: [
                    Widget.Icon(icons.ui.settings),
                    Widget.Label('Network'),
                ],
            }),
        }),
    ],
});
