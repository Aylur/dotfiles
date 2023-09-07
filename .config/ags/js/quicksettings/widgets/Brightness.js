import icons from '../../icons.js';
import Brightness from '../../services/brightness.js';
const { Label, Slider, Box, Icon } = ags.Widget;

const BrightnessSlider = () => Slider({
    drawValue: false,
    hexpand: true,
    connections: [
        [Brightness, slider => {
            slider.value = Brightness.screen;
        }],
    ],
    onChange: ({ value }) => Brightness.screen = value,
});

const PercentLabel = () => Label({
    connections: [[Brightness, label => {
        label.label = `${Math.floor(Brightness.screen * 100)}%`;
    }]],
});

export default () => Box({
    className: 'slider',
    children: [
        Icon({
            icon: icons.brightness.indicator,
            className: 'icon',
        }),
        BrightnessSlider(),
        PercentLabel(),
    ],
});
