import icons from '../../icons.js';
import Brightness from '../../services/brightness.js';
import { Widget } from '../../imports.js';

const BrightnessSlider = () => Widget.Slider({
    drawValue: false,
    hexpand: true,
    binds: [['value', Brightness, 'screen']],
    onChange: ({ value }) => Brightness.screen = value,
});

export default () => Widget.Box({
    className: 'slider',
    children: [
        Widget.Icon({
            icon: icons.brightness.indicator,
            className: 'icon',
            binds: [['tooltip-text', Brightness, 'screen', v =>
                `Screen Brightness: ${Math.floor(v * 100)}%`]],
        }),
        BrightnessSlider(),
    ],
});
