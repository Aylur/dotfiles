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
const { Window, CenterBox, Box } = ags.Widget;

const SeparatorDot = rest => Separator({
    ...rest,
    orientation: 'vertical',
    valign: 'center',
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
        SeparatorDot({
            connections: [[ags.Service.Notifications, dot => {
                dot.visible = ags.Service.Notifications.notifications.size > 0;
            }]],
        }),
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
        SeparatorDot({
            connections: [[ags.Service.Mpris, dot => {
                dot.visible = !!ags.Service.Mpris.getPlayer();
            }]],
        }),
        MediaIndicator(),
        Box({ hexpand: true }),
        ScreenRecord(),
        SeparatorDot({
            connections: [[ags.Service.Recorder, dot => {
                dot.visible = ags.Service.Recorder.recording;
            }]],
        }),
        SysTray(),
        SeparatorDot({
            connections: [[ags.Service.SystemTray, dot => {
                dot.visible = ags.Service.SystemTray.items.length > 0;
            }]],
        }),
        ColorPicker(),
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
