import Bluetooth from 'resource:///com/github/Aylur/ags/service/bluetooth.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import icons from '../../icons.js';
import { Menu, ArrowToggleButton } from '../ToggleButton.js';

export const BluetoothToggle = () => ArrowToggleButton({
    name: 'bluetooth',
    icon: Widget.Icon({
        icon: Bluetooth.bind('enabled').transform(p => icons.bluetooth[p ? 'enabled' : 'disabled']),
    }),
    label: Widget.Label({
        truncate: 'end',
        setup: self => self.hook(Bluetooth, () => {
            if (!Bluetooth.enabled)
                return self.label = 'Disabled';

            if (Bluetooth.connected_devices.length === 0)
                return self.label = 'Not Connected';

            if (Bluetooth.connected_devices.length === 1)
                return self.label = Bluetooth.connected_devices[0].alias;

            self.label = `${Bluetooth.connected_devices.length} Connected`;
        }),
    }),
    connection: [Bluetooth, () => Bluetooth.enabled],
    deactivate: () => Bluetooth.enabled = false,
    activate: () => Bluetooth.enabled = true,
});

/** @param {import('types/service/bluetooth').BluetoothDevice} device */
const DeviceItem = device => Widget.Box({
    children: [
        Widget.Icon(device.icon_name + '-symbolic'),
        Widget.Label(device.name),
        Widget.Label({
            label: `${device.battery_percentage}%`,
            visible: device.bind('battery_percentage').transform(p => p > 0),
        }),
        Widget.Box({ hexpand: true }),
        Widget.Spinner({
            active: device.bind('connecting'),
            visible: device.bind('connecting'),
        }),
        Widget.Switch({
            active: device.connected,
            visible: device.bind('connecting').transform(p => !p),
            setup: self => self.on('notify::active', () => {
                device.setConnection(self.active);
            }),
        }),
    ],
});

export const BluetoothDevices = () => Menu({
    name: 'bluetooth',
    icon: Widget.Icon(icons.bluetooth.disabled),
    title: Widget.Label('Bluetooth'),
    content: [
        Widget.Box({
            hexpand: true,
            vertical: true,
            children: Bluetooth.bind('devices').transform(ds => ds
                .filter(d => d.name)
                .map(DeviceItem)),
        }),
    ],
});
