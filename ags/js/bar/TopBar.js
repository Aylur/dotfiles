import OverviewButton from './buttons/OverviewButton.js';
import Workspaces from './buttons/Workspaces.js';
import FocusedClient from './buttons/FocusedClient.js';
import MediaIndicator from './buttons/MediaIndicator.js';
import DateButton from './buttons/DateButton.js';
import NotificationIndicator from './buttons/NotificationIndicator.js';
import SysTray from './buttons/SysTray.js';
import ColorPicker from './buttons/ColorPicker.js';
import SystemIndicators from './buttons/SystemIndicators.js';
import PowerMenu from './buttons/PowerMenu.js';
import Separator from '../misc/Separator.js';
import ScreenRecord from './buttons/ScreenRecord.js';
import BatteryBar from './buttons/BatteryBar.js';
import SubMenu from './buttons/SubMenu.js';
import { SystemTray, Widget, Variable } from '../imports.js';
import { Notifications, Mpris, Battery } from '../imports.js';
import Recorder from '../services/screenrecord.js';

const submenuItems = Variable(1);
SystemTray.connect('changed', () => {
    submenuItems.setValue(SystemTray.items.length + 1);
});

const SeparatorDot = (service, condition) => Separator({
    orientation: 'vertical',
    valign: 'center',
    connections: service && [[service, dot => {
        dot.visible = condition(service);
    }]],
});

const Start = () => Widget.Box({
    className: 'start',
    children: [
        OverviewButton(),
        SeparatorDot(),
        Workspaces(),
        SeparatorDot(),
        FocusedClient(),
        Widget.Box({ hexpand: true }),
        NotificationIndicator(),
        SeparatorDot(Notifications, n => n.notifications.length > 0 || n.dnd),
    ],
});

const Center = () => Widget.Box({
    className: 'center',
    children: [
        DateButton(),
    ],
});

const End = () => Widget.Box({
    className: 'end',
    children: [
        SeparatorDot(Mpris, m => m.players.length > 0),
        MediaIndicator(),
        Widget.Box({ hexpand: true }),

        SubMenu({
            items: submenuItems,
            children: [
                SysTray(),
                ColorPicker(),
            ],
        }),
        SeparatorDot(),
        ScreenRecord(),
        SeparatorDot(Recorder, r => r.recording),
        SystemIndicators(),
        SeparatorDot(Battery, b => b.available),
        BatteryBar(),
        SeparatorDot(),
        PowerMenu(),
    ],
});

export default monitor => Widget.Window({
    name: `bar${monitor}`,
    exclusive: true,
    monitor,
    anchor: ['top', 'left', 'right'],
    child: Widget.CenterBox({
        className: 'panel',
        startWidget: Start(),
        centerWidget: Center(),
        endWidget: End(),
    }),
});
