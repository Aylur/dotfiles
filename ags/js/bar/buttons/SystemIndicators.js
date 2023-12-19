import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import Bluetooth from 'resource:///com/github/Aylur/ags/service/bluetooth.js';
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import Network from 'resource:///com/github/Aylur/ags/service/network.js';
import HoverRevealer from '../../misc/HoverRevealer.js';
import PanelButton from '../PanelButton.js';
import Asusctl from '../../services/asusctl.js';
import Indicator from '../../services/onScreenIndicator.js';
import icons from '../../icons.js';
import FontIcon from '../../misc/FontIcon.js';

const ProfileIndicator = () => Widget.Icon()
    .bind('visible', Asusctl, 'profile', p => p !== 'Balanced')
    .bind('icon', Asusctl, 'profile', i => icons.asusctl.profile[i]);

const ModeIndicator = () => FontIcon()
    .bind('visible', Asusctl, 'mode', m => m !== 'Hybrid')
    .bind('icon', Asusctl, 'mode', i => icons.asusctl.mode[i]);

const MicrophoneIndicator = () => Widget.Icon().hook(Audio, icon => {
    if (!Audio.microphone)
        return;

    const { muted, low, medium, high } = icons.audio.mic;
    if (Audio.microphone.is_muted)
        return icon.icon = muted;

    /** @type {Array<[number, string]>} */
    const cons = [[67, high], [34, medium], [1, low], [0, muted]];
    icon.icon = cons.find(([n]) => n <= Audio.microphone.volume * 100)?.[1] || '';

    icon.visible = Audio.recorders.length > 0 || Audio.microphone.is_muted;
}, 'speaker-changed');

const DNDIndicator = () => Widget.Icon({
    visible: Notifications.bind('dnd'),
    icon: icons.notifications.silent,
});

const BluetoothDevicesIndicator = () => Widget.Box().hook(Bluetooth, box => {
    box.children = Bluetooth.connectedDevices
        .map(({ iconName, name }) => HoverRevealer({
            indicator: Widget.Icon(iconName + '-symbolic'),
            child: Widget.Label(name),
        }));

    box.visible = Bluetooth.connectedDevices.length > 0;
}, 'notify::connected-devices');

const BluetoothIndicator = () => Widget.Icon({
    class_name: 'bluetooth',
    icon: icons.bluetooth.enabled,
    visible: Bluetooth.bind('enabled'),
});

const NetworkIndicator = () => Widget.Icon().hook(Network, self => {
    const icon = Network[Network.primary || 'wifi']?.iconName;
    self.icon = icon || '';
    self.visible = !!icon;
});

const AudioIndicator = () => Widget.Icon().hook(Audio, self => {
    if (!Audio.speaker)
        return;

    const { muted, low, medium, high, overamplified } = icons.audio.volume;
    if (Audio.speaker.is_muted)
        return self.icon = muted;


    /** @type {Array<[number, string]>} */
    const cons = [[101, overamplified], [67, high], [34, medium], [1, low], [0, muted]];
    self.icon = cons.find(([n]) => n <= Audio.speaker.volume * 100)?.[1] || '';
}, 'speaker-changed');

export default () => PanelButton({
    class_name: 'quicksettings panel-button',
    on_clicked: () => App.toggleWindow('quicksettings'),
    setup: self => self
        .hook(App, (_, win, visible) => {
            self.toggleClassName('active', win === 'quicksettings' && visible);
        }),
    on_scroll_up: () => {
        Audio.speaker.volume += 0.02;
        Indicator.speaker();
    },
    on_scroll_down: () => {
        Audio.speaker.volume -= 0.02;
        Indicator.speaker();
    },
    content: Widget.Box({
        children: [
            Asusctl?.available && ProfileIndicator(),
            Asusctl?.available && ModeIndicator(),
            DNDIndicator(),
            BluetoothDevicesIndicator(),
            BluetoothIndicator(),
            NetworkIndicator(),
            AudioIndicator(),
            MicrophoneIndicator(),
        ],
    }),
});
