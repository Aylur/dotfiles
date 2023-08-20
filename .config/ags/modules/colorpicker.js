const { Notifications } = ags.Service;
const { execAsync } = ags.Utils;
const { Gravity } = imports.gi.Gdk;
const { Button, Icon, Menu, MenuItem, Label } = ags.Widget;

const wlCopy = color => execAsync(['wl-copy', color]).catch(print);

export const PanelButton = props => Button({
    ...props,
    className: 'panel-button colorpicker',
    child: Icon('color-select-symbolic'),
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
    onSecondaryClick: btn => btn._colors.length > 0 ? Menu({
        className: 'colorpicker',
        children: btn._colors.map(color => MenuItem({
            child: Label(color),
            style: `background-color: ${color}`,
            onActivate: () => wlCopy(color),
        })),
    }).popup_at_widget(btn, Gravity.WEST, Gravity.EAST, null) : false,
});
