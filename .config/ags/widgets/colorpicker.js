const { execAsync } = ags.Utils;
const { Widget } = ags;

Widget.widgets['colorpicker'] = props => Widget({
    ...props,
    type: 'button',
    className: 'colorpicker',
    onClick: () => execAsync('hyprpicker -a'),
    child: {
        type: 'icon',
        icon: 'color-select-symbolic',
        size: 18,
    },
});
