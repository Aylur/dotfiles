import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { Variable } from 'resource:///com/github/Aylur/ags/variable.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import PanelButton from '../PanelButton.js';
import Gdk from 'gi://Gdk';

const COLORS_CACHE = Utils.CACHE_DIR + '/colorpicker.json';

/** @param {string} color */
const wlCopy = color => Utils.execAsync(['wl-copy', color])
    .catch(err => console.error(err));

/** @type {Variable<string[]>} */
const colors = new Variable([]);
Utils.readFileAsync(COLORS_CACHE)
    .then(out => colors.setValue(JSON.parse(out || '[]')))
    .catch(() => print('no colorpicker cache found'));

let notifId = 0;

export default () => PanelButton({
    class_name: 'color-picker',
    content: Widget.Icon('color-select-symbolic'),
    binds: [['tooltip-text', colors, 'value', v => `${v.length} colors`]],
    on_clicked: () => Utils.execAsync('hyprpicker').then(color => {
        if (!color)
            return;

        wlCopy(color);
        const list = colors.value;
        if (!list.includes(color)) {
            list.push(color);
            if (list.length > 10)
                list.shift();

            colors.value = list;
            Utils.writeFile(JSON.stringify(list, null, 2), COLORS_CACHE)
                .catch(err => console.error(err));
        }

        notifId = Notifications.Notify(
            'Color Picker',
            notifId,
            'color-select-symbolic',
            color,
            '',
            [],
            {},
        );
    }).catch(err => console.error(err)),
    on_secondary_click: btn => colors.value.length > 0 ? Widget.Menu({
        class_name: 'colorpicker',
        children: colors.value.map(color => Widget.MenuItem({
            child: Widget.Label(color),
            css: `background-color: ${color}`,
            on_activate: () => wlCopy(color),
        })),
    }).popup_at_widget(btn, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null) : false,
});
