import Header from './widgets/Header.js';
import PopupWindow from '../misc/PopupWindow.js';
import { Volume, SinkSelector, AppMixer } from './widgets/Volume.js';
import { NetworkToggle, WifiSelection } from './widgets/Network.js';
import { BluetoothToggle, BluetoothDevices } from './widgets/Bluetooth.js';
import { ThemeToggle, ThemeSelector } from './widgets/Theme.js';
import { ProfileToggle, ProfileSelector } from './widgets/AsusProfile.js';
import Media from './widgets/Media.js';
import Brightness from './widgets/Brightness.js';
import DND from './widgets/DND.js';
import MicMute from './widgets/MicMute.js';
const { Box } = ags.Widget;

const Row = (toggles, menus = []) => Box({
    className: 'row',
    vertical: true,
    children: [
        Box({
            children: toggles,
        }),
        ...menus,
    ],
});

const Homogeneous = toggles => Box({
    homogeneous: true,
    children: toggles,
});

export default () => PopupWindow({
    name: 'quicksettings',
    anchor: 'top right',
    layout: 'top right',
    content: Box({
        className: 'quicksettings',
        vertical: true,
        children: [
            Row(
                [Header()],
            ),
            Row([Box({
                className: 'slider-box',
                vertical: true,
                children: [
                    Row(
                        [Volume()],
                        [SinkSelector(), AppMixer()],
                    ),
                    Row(
                        [Brightness()],
                    ),
                ],
            })]),
            Row(
                [Homogeneous([NetworkToggle(), BluetoothToggle()]), DND()],
                [WifiSelection(), BluetoothDevices()],
            ),
            Row(
                [Homogeneous([ProfileToggle(), ThemeToggle()]), MicMute()],
                [ProfileSelector(), ThemeSelector()],
            ),
            // Row(
            //     [DND(), MicMute()],
            // ),
            Media(),
        ],
    }),
});
