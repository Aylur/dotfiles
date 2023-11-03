import icons from '../../icons.js';
import Brightness from '../../services/brightness.js';
import { Widget } from '../../imports.js';

const BrightnessSlider = () => Widget.Slider({
    draw_value: false,
    hexpand: true,
    binds: [['value', Brightness, 'screen']],
    on_change: ({ value }) => Brightness.screen = value,
});

export default () => Widget.Box({
    class_name: 'slider',
    children: [
        Widget.Icon({
            icon: icons.brightness.indicator,
            class_name: 'icon',
            binds: [['tooltip-text', Brightness, 'screen', v =>
                `Screen Brightness: ${Math.floor(v * 100)}%`]],
        }),
        BrightnessSlider(),
    ],
});
