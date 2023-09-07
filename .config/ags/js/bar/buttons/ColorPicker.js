import PanelButton from '../PanelButton.js';
const { Notifications } = ags.Service;
const { execAsync, writeFile, readFileAsync, CACHE_DIR } = ags.Utils;
const { Gravity } = imports.gi.Gdk;
const { Icon, Menu, MenuItem, Label } = ags.Widget;
const COLORS_CACHE = CACHE_DIR + '/colorpicker.json';

const wlCopy = color => execAsync(['wl-copy', color]).catch(print);

let colors = [];
readFileAsync(COLORS_CACHE)
    .catch(() => print('no colorpicker cache found'))
    .then(out => colors = JSON.parse(out || '[]'));

export default () => PanelButton({
    className: 'panel-button colorpicker',
    content: Icon('color-select-symbolic'),
    connections: [['clicked', btn => execAsync('hyprpicker').then(color => {
        if (!color)
            return;

        wlCopy(color);
        if (!colors.includes(color)) {
            colors.push(color);
            if (colors > 10)
                colors.shift();

            writeFile(JSON.stringify(colors, null, 2), COLORS_CACHE);
        }

        btn._id = Notifications.instance.Notify(
            'Color Picker',
            btn._id || null,
            'color-select-symbolic',
            color,
            '',
            [],
            {},
        );
    }).catch(print)]],
    onSecondaryClick: btn => colors.length > 0 ? Menu({
        className: 'colorpicker',
        children: colors.map(color => MenuItem({
            child: Label(color),
            style: `background-color: ${color}`,
            onActivate: () => wlCopy(color),
        })),
    }).popup_at_widget(btn, Gravity.SOUTH, Gravity.NORTH, null) : false,
});
