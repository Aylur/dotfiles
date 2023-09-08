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
const { Window, CenterBox, Box } = ags.Widget;

const SeparatorDot = (service, condition) => Separator({
    orientation: 'vertical',
    valign: 'center',
    connections: service && [[service, dot => dot.visible = condition()]],
});

const Start = () => Box({
    className: 'start',
    children: [
        OverviewButton(),
        SeparatorDot(),
        Workspaces(),
        SeparatorDot(),
        FocusedClient(),
        Box({ hexpand: true }),
        NotificationIndicator(),
        SeparatorDot(
            ags.Service.Notifications,
            () => ags.Service.Notifications.notifications.size > 0,
        ),
    ],
});

const Center = () => Box({
    className: 'center',
    children: [
        DateButton(),
    ],
});

const End = () => Box({
    className: 'end',
    children: [
        SeparatorDot(
            ags.Service.Mpris,
            () => !!ags.Service.Mpris.getPlayer(),
        ),
        MediaIndicator(),
        Box({ hexpand: true }),
        ScreenRecord(),
        SeparatorDot(
            ags.Service.Recorder,
            () => ags.Service.Recorder.recording,
        ),
        SysTray(),
        SeparatorDot(
            ags.Service.SystemTray,
            () => ags.Service.SystemTray.items.length > 0,
        ),
        ColorPicker(),
        SeparatorDot(
            ags.Service.Battery,
            () => ags.Service.available,
        ),
        BatteryBar(),
        SeparatorDot(),
        SystemIndicators(),
        SeparatorDot(),
        PowerMenu(),
    ],
});

export default monitor => Window({
    name: `bar${monitor}`,
    exclusive: true,
    monitor,
    anchor: 'top left right',
    child: CenterBox({
        className: 'panel',
        startWidget: Start(),
        centerWidget: Center(),
        endWidget: End(),
    }),
});
