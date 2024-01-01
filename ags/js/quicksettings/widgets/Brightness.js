import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import icons from '../../icons.js';
import Brightness from '../../services/brightness.js';

const BrightnessSlider = () => Widget.Slider({
    draw_value: false,
    hexpand: true,
    value: Brightness.bind('screen'),
    on_change: ({ value }) => Brightness.screen = value,
});

export default () => Widget.Box({
    children: [
        Widget.Button({
            child: Widget.Icon(icons.brightness.indicator),
            tooltip_text: Brightness.bind('screen').transform(v =>
                `Screen Brightness: ${Math.floor(v * 100)}%`),
        }),
        BrightnessSlider(),
    ],
});
