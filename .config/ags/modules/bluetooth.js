import { Spinner } from './misc.js';
const { Bluetooth } = ags.Service;
const { Icon, Label, Box, Button, Stack } = ags.Widget;

export const Indicator = ({
    enabled = Icon({ icon: 'bluetooth-active-symbolic', className: 'enabled' }),
    disabled = Icon({ icon: 'bluetooth-disabled-symbolic', className: 'disabled' }),
    ...props
} = {}) => Stack({
    ...props,
    items: [
        ['true', enabled],
        ['false', disabled],
    ],
    connections: [[Bluetooth, stack => {
        stack.shown = `${Bluetooth.enabled}`;
    }]],
});

export const Toggle = props => Button({
    ...props,
    onClicked: () => Bluetooth.enabled = !Bluetooth.enabled,
    connections: [[Bluetooth, button => button.toggleClassName('on', Bluetooth.enabled)]],
});

export const ConnectedLabel = props => Label({
    ...props,
    connections: [[Bluetooth, label => {
        if (!Bluetooth.enabled)
            return label.label = 'Disabled';

        if (Bluetooth.connectedDevices.size === 0)
            return label.label = 'Not Connected';

        if (Bluetooth.connectedDevices.size === 1)
            return label.label = Bluetooth.connectedDevices.entries().next().value[1].alias;

        label.label = `${Bluetooth.connectedDevices.size} Connected`;
    }]],
});

export const Devices = props => Box({
    ...props,
    vertical: true,
    connections: [[Bluetooth, box => {
        box.children = Array.from(Bluetooth.devices.values()).map(device => Box({
            hexpand: false,
            children: [
                Icon(device.iconName + '-symbolic'),
                Label(device.name),
                Box({ hexpand: true }),
                device._connecting ? Spinner() : ags.Widget({
                    type: imports.gi.Gtk.Switch,
                    active: device.connected,
                    connections: [['activate', ({ active }) => {
                        device.setConnection(active);
                    }]],
                }),
            ],
        }));
    }]],
});
