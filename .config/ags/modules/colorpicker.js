const { Notifications } = ags.Service;
const { execAsync } = ags.Utils;
const { Widget } = ags;
const { Gravity } = imports.gi.Gdk;

const wlCopy = color => execAsync(['wl-copy', color]).catch(print);

Widget.widgets['colorpicker'] = props => Widget({
    child: {
        type: 'icon',
        icon: 'color-select-symbolic',
    },
    ...props,
    type: 'button',
    properties: [['colors', []]],
    connections: [['clicked', btn => execAsync('hyprpicker').then(color => {
        wlCopy(color);
        if (!btn._colors.includes(color)) {
            btn._colors.push(color);
            if (btn._colors > 10)
                btn._colors.shift();
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
    onSecondaryClick: (btn, event) => btn._colors.length > 0 ? Widget({
        type: 'menu',
        className: 'colorpicker',
        children: btn._colors.map(color => ({
            type: 'menuitem',
            child: color,
            style: `background-color: ${color}`,
            onActivate: () => wlCopy(color),
        })),
    }).popup_at_widget(btn, Gravity.WEST, Gravity.EAST, event) : false,
});
