const { execAsync } = ags.Utils;
const { Widget } = ags;

Widget.widgets['colorpicker'] = () => Widget({
    type: 'button',
    className: 'colorpicker',
    onClick: () => execAsync('hyprpicker -a'),
    child: {
        type: 'icon',
        icon: 'color-select-symbolic',
        size: 18,
    },
});
