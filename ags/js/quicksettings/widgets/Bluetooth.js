import Bluetooth from 'resource:///com/github/Aylur/ags/service/bluetooth.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import icons from '../../icons.js';
import { Menu, ArrowToggleButton } from '../ToggleButton.js';

export const BluetoothToggle = () => ArrowToggleButton({
    name: 'bluetooth',
    icon: Widget.Icon({
        connections: [[Bluetooth, icon => {
            icon.icon = Bluetooth.enabled
                ? icons.bluetooth.enabled
                : icons.bluetooth.disabled;
        }]],
    }),
    label: Widget.Label({
        truncate: 'end',
        connections: [[Bluetooth, label => {
            if (!Bluetooth.enabled)
                return label.label = 'Disabled';

            if (Bluetooth.connectedDevices.length === 0)
                return label.label = 'Not Connected';

            if (Bluetooth.connectedDevices.length === 1)
                return label.label = Bluetooth.connectedDevices[0].alias;

            label.label = `${Bluetooth.connectedDevices.length} Connected`;
        }]],
    }),
    connection: [Bluetooth, () => Bluetooth.enabled],
    deactivate: () => Bluetooth.enabled = false,
    activate: () => Bluetooth.enabled = true,
});

const DeviceItem = device => Widget.Box({
    children: [
        Widget.Icon(device.icon_name + '-symbolic'),
        Widget.Label(device.name),
        Widget.Label({
            label: `${device.battery_percentage}%`,
            binds: [['visible', device, 'battery-percentage', p => p > 0]],
        }),
        Widget.Box({ hexpand: true }),
        Widget.Spinner({
            binds: [
                ['active', device, 'connecting'],
                ['visible', device, 'connecting'],
            ],
        }),
        Widget.Switch({
            active: device.connected,
            binds: [['visible', device, 'connecting', c => !c]],
            connections: [['notify::active', ({ active }) => {
                device.setConnection(active);
            }]],
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
            binds: [['children', Bluetooth, 'devices', ds => ds
                .filter(d => d.name)
                .map(DeviceItem)]],
        }),
    ],
});
