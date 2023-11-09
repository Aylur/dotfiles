import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import icons from '../icons.js';
import PowerMenu from '../services/powermenu.js';
import PopupWindow from '../misc/PopupWindow.js';

/**
 * @param {'sleep' | 'reboot' | 'logout' | 'shutdown'} action
 * @param {string} label
 */
const SysButton = (action, label) => Widget.Button({
    on_clicked: () => PowerMenu.action(action),
    child: Widget.Box({
        vertical: true,
        children: [
            Widget.Icon(icons.powermenu[action]),
            Widget.Label(label),
        ],
    }),
});

export default () => PopupWindow({
    name: 'powermenu',
    expand: true,
    content: Widget.Box({
        class_name: 'powermenu',
        homogeneous: true,
        children: [
            SysButton('sleep', 'Sleep'),
            SysButton('reboot', 'Reboot'),
            SysButton('logout', 'Log Out'),
            SysButton('shutdown', 'Shutdown'),
        ],
    }),
});
