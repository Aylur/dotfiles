import PanelButton from '../PanelButton.js';
import { Notifications, Utils, Widget, Variable } from '../../imports.js';
import Gdk from 'gi://Gdk';

const COLORS_CACHE = Utils.CACHE_DIR + '/colorpicker.json';
const wlCopy = color => Utils.execAsync(['wl-copy', color])
    .catch(err => console.error(err));

const colors = Variable([]);
Utils.readFileAsync(COLORS_CACHE)
    .then(out => colors.setValue(JSON.parse(out || '[]')))
    .catch(() => print('no colorpicker cache found'));

export default () => PanelButton({
    class_name: 'panel-button colorpicker',
    content: Widget.Icon('color-select-symbolic'),
    binds: [['tooltip-text', colors, 'value', v => `${v.length} colors`]],
    onClicked: btn => Utils.execAsync('hyprpicker').then(color => {
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

        btn._id = Notifications.Notify(
            'Color Picker',
            btn._id || null,
            'color-select-symbolic',
            color,
            '',
            [],
            {},
        );
    }).catch(err => console.error(err)),
    onSecondaryClick: btn => colors.value.length > 0 ? Widget.Menu({
        class_name: 'colorpicker',
        children: colors.value.map(color => Widget.MenuItem({
            child: Widget.Label(color),
            css: `background-color: ${color}`,
            on_activate: () => wlCopy(color),
        })),
    }).popup_at_widget(btn, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null) : false,
});
