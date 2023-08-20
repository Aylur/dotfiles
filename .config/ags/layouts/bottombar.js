import * as shared from './shared.js';
import { Launcher } from './shared.js';
import { Workspaces } from './widgets/hyprland.js';
import { Separator } from '../modules/misc.js';
import { PanelIndicator as MediaIndicator } from './widgets/media.js';
import { DistroIcon } from '../modules/misc.js';
import { PanelButton as ColorPicker } from '../modules/colorpicker.js';
import { PanelButton as PowerMenu } from './widgets/powermenu.js';
import { PanelButton as DashBoard } from './widgets/dashboard.js';
import { PanelButton as ScreenRecord } from '../modules/screenrecord.js';
import { PanelButton as QuickSettings } from './widgets/quicksettings.js';
import { Dock } from './widgets/dock.js';

const Bar = monitor => shared.Bar({
    anchor: 'bottom left right',
    monitor,
    start: [
        Launcher({ child: DistroIcon() }),
        Separator({ valign: 'center' }),
        Workspaces(),
    ],
    center: [
        Dock(),
    ],
    end: [
        ags.Widget.Box({ hexpand: true }),
        MediaIndicator(),
        ScreenRecord(),
        QuickSettings(),
        Separator({ valign: 'center' }),
        ColorPicker(),
        Separator({ valign: 'center' }),
        DashBoard({ format: '%H:%M:%S%n%e. %A' }),
        Separator({ valign: 'center' }),
        PowerMenu(),
    ],
});

export default monitors => ([
    ...monitors.map(mon => [
        Bar(mon),
        shared.Notifications(mon, 'slide_left', 'bottom right'),
        shared.Desktop(mon),
        ...shared.Corners(mon),
        shared.OSDIndicator(mon),
    ]),
    shared.Quicksettings({ position: 'bottom right' }),
    shared.Dashboard({ position: 'bottom right' }),
]).flat(2);
